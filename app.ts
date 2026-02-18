import { MongoClient } from 'mongodb';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'myapp';
const COLLECTION_NAME = process.env.COLLECTION_NAME || 'users';

// Simple prompt function using Bun's built-in prompt (works in Bun 1.3.6)
function askQuestion(query: string): Promise<string> {
  return new Promise((resolve) => {
    console.log(query);
    // Use setTimeout to ensure the prompt is shown after the console.log
    setTimeout(() => {
      const answer = prompt('> ');
      resolve(answer || '');
    }, 100);
  });
}

// Alternative using readline if prompt doesn't work
async function askQuestionReadline(query: string): Promise<string> {
  console.log(query);
  
  const reader = Bun.stdin.stream();
  const reader2 = reader.getReader();
  const { value } = await reader2.read();
  reader2.releaseLock();
  
  return new TextDecoder().decode(value).trim();
}

// Prompt for yes/no questions
async function askYesNo(query: string): Promise<boolean> {
  const answer = await askQuestion(`${query} (y/n):`);
  return answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes';
}

// Display all users in a formatted table
async function displayUsers(collection: any) {
  const users = await collection.find({}).toArray();
  
  console.log('\n' + '='.repeat(80));
  console.log('📊 CURRENT USERS');
  console.log('='.repeat(80));
  
  if (users.length === 0) {
    console.log('No users found in collection');
    return null;
  }

  // Format the data for better display
  const formattedUsers = users.map(user => ({
    ID: user._id.toString().substring(0, 8) + '...',
    User: user.User,
    Money: new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(user.Money),
    Created: user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'
  }));
  
  console.table(formattedUsers);
  
  return users;
}

// Interactive user creation
async function createUser(collection: any) {
  console.log('\n' + '-'.repeat(40));
  console.log('🆕 CREATE NEW USER');
  console.log('-'.repeat(40));

  const name = await askQuestion('Enter user name:');
  if (!name) {
    console.log('❌ User name cannot be empty');
    return null;
  }

  let money: number;
  while (true) {
    const moneyStr = await askQuestion('Enter money amount:');
    money = parseFloat(moneyStr);
    if (!isNaN(money) && money >= 0) break;
    console.log('❌ Please enter a valid positive number');
  }

  const newUser = {
    User: name,
    Money: money,
    createdAt: new Date()
  };

  const result = await collection.insertOne(newUser);
  console.log('✅ User created successfully with ID:', result.insertedId);
  
  return result.insertedId;
}

// Interactive user modification
async function modifyUser(collection: any, users: any[]) {
  console.log('\n' + '-'.repeat(40));
  console.log('✏️  MODIFY USER');
  console.log('-'.repeat(40));

  // Show users with indices for easy selection
  users.forEach((user, index) => {
    const moneyFormatted = new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: 'USD' 
    }).format(user.Money);
    console.log(`[${index + 1}] ${user.User} - ${moneyFormatted}`);
  });

  const selection = await askQuestion('\nSelect user number to modify (or 0 to cancel):');
  const index = parseInt(selection) - 1;

  if (selection === '0' || isNaN(index) || index < 0 || index >= users.length) {
    console.log('Operation cancelled');
    return;
  }

  const selectedUser = users[index];
  console.log(`\nModifying user: ${selectedUser.User}`);

  // Ask what to modify
  console.log('\nWhat would you like to modify?');
  console.log('[1] User name');
  console.log('[2] Money amount');
  console.log('[3] Both');
  console.log('[4] Delete user');
  
  const choice = await askQuestion('Enter choice (1-4):');

  if (choice === '4') {
    const confirm = await askYesNo(`Are you sure you want to delete user "${selectedUser.User}"?`);
    if (confirm) {
      await collection.deleteOne({ _id: selectedUser._id });
      console.log('✅ User deleted successfully');
    } else {
      console.log('Deletion cancelled');
    }
    return;
  }

  const updates: any = {};
  
  if (choice === '1' || choice === '3') {
    const newName = await askQuestion(`Enter new name (current: ${selectedUser.User}):`);
    if (newName) updates.User = newName;
  }
  
  if (choice === '2' || choice === '3') {
    while (true) {
      const newMoney = await askQuestion(`Enter new money amount (current: ${selectedUser.Money}):`);
      if (!newMoney) break;
      const moneyNum = parseFloat(newMoney);
      if (!isNaN(moneyNum) && moneyNum >= 0) {
        updates.Money = moneyNum;
        break;
      }
      console.log('❌ Please enter a valid positive number');
    }
  }

  if (Object.keys(updates).length === 0) {
    console.log('No updates provided');
    return;
  }

  const result = await collection.updateOne(
    { _id: selectedUser._id },
    { $set: updates }
  );

  if (result.modifiedCount > 0) {
    console.log('✅ User updated successfully');
  } else {
    console.log('❌ No changes made');
  }
}

// Main interactive loop
async function main() {
  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    console.log('✅ Connected to MongoDB\n');

    const db = client.db(DB_NAME);
    const collection = db.collection(COLLECTION_NAME);

    let running = true;

    while (running) {
      console.log('\n' + '='.repeat(80));
      console.log('🎯 MAIN MENU'.padStart(42, ' '));
      console.log('='.repeat(80));
      
      // Show current users
      const users = await displayUsers(collection);
      
      console.log('\n📋 Options:');
      console.log('  [1] Add new user');
      console.log('  [2] Modify existing user');
      console.log('  [3] Refresh view');
      console.log('  [4] Exit');

      const choice = await askQuestion('\n👉 What would you like to do?');

      switch (choice) {
        case '1':
          await createUser(collection);
          break;
        
        case '2':
          if (users && users.length > 0) {
            await modifyUser(collection, users);
          } else {
            console.log('❌ No users to modify');
          }
          break;
        
        case '3':
          console.log('🔄 Refreshing...');
          break;
        
        case '4':
          console.log('👋 Goodbye!');
          running = false;
          break;
        
        default:
          console.log('❌ Invalid choice, please try again (1-4)');
      }
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
    console.log('📡 Disconnected from MongoDB');
  }
}

// Add some sample data if collection is empty
async function seedSampleData(collection: any) {
  const count = await collection.countDocuments();
  if (count === 0) {
    console.log('📝 Adding sample data...');
    const sampleUsers = [
      { User: "Alice", Money: 2500.50, createdAt: new Date() },
      { User: "Bob", Money: 3800.75, createdAt: new Date() },
      { User: "Charlie", Money: 5200.00, createdAt: new Date() }
    ];
    await collection.insertMany(sampleUsers);
    console.log('✅ Sample data added');
  }
}

// Run the app with unhandled rejection handler
process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
  process.exit(1);
});

// Run the app
main().catch(console.error);
