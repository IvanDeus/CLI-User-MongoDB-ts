# CLI-User-MongoDB-ts
Simple Bun TypeScript MongoDB Insert Read CLI

# CLI User Management with MongoDB and Bun

A command-line interface application for managing users in MongoDB with an interactive menu system. Built with TypeScript and Bun runtime.

## 🌟 Features

- Interactive CLI menu
- Create, Read, Update, Delete (CRUD) operations
- Formatted currency display
- Russian language support (Unicode)
- Data validation
- Docker support
- Bun runtime optimization
- TypeScript for type safety

## Prerequisites

### 1. Install Bun
Bun is a fast all-in-one JavaScript runtime. Choose your installation method:

#### macOS/Linux:
```bash
curl -fsSL https://bun.sh/install | bash
```

#### Windows (using WSL2):
```bash
# First install WSL2, then in WSL terminal:
curl -fsSL https://bun.sh/install | bash
```

#### Verify installation:
```bash
bun --version
# Should show: 1.3.6 or higher
```

### 2. Install MongoDB using Docker

#### Install Docker
- **macOS**: Download and install [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/)
- **Windows**: Download and install [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/)
- **Linux**: Use your package manager:
  ```bash
  # Ubuntu/Debian
  sudo apt update
  sudo apt install docker.io docker-compose
  
  # Start Docker service
  sudo systemctl start docker
  sudo systemctl enable docker
  ```

#### Run MongoDB container
```bash
# Pull and run MongoDB
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -v mongodb_data:/data/db \
  --restart unless-stopped \
  mongo:latest

# Verify MongoDB is running
docker ps | grep mongodb
```

#### MongoDB connection string
```
mongodb://localhost:27017
```

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd CLI-User-MongoDB-ts
```

### 2. Install dependencies
```bash
bun install
```

### 3. Configure environment (optional)
Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017
DB_NAME=myapp
COLLECTION_NAME=users
```

### 4. Run the application
```bash
bun run app.ts
```

## 📖 Usage Guide

### Main Menu
When you start the application, you'll see:
- Current users displayed in a formatted table
- Interactive menu with options

```
==================================================
🎯 MAIN MENU                                      
==================================================

📊 CURRENT USERS
==================================================
┌───┬──────────┬───────────────────┬───────────────┬───────────────────────┐
│   │ ID       │ User              │ Money         │ Created               │
├───┼──────────┼───────────────────┼───────────────┼───────────────────────┤
│ 0 │ 69959... │ Pek               │ $1,233,214.40 │ 2/18/2026, 1:23:47 PM │
└───┴──────────┴───────────────────┴───────────────┴───────────────────────┘

📋 Options:
  [1] Add new user
  [2] Modify existing user
  [3] Refresh view
  [4] Exit

👉 What would you like to do?
```

### Features

#### ➕ Add New User (Option 1)
1. Select option `1`
2. Enter user name (required)
3. Enter money amount (positive number)
4. User is automatically saved to MongoDB

#### ✏️ Modify User (Option 2)
1. Select option `2`
2. Choose user number from the list
3. Select what to modify:
   - `[1]` Change user name
   - `[2]` Change money amount
   - `[3]` Change both
   - `[4]` Delete user
4. Follow the prompts to update information

#### 🔄 Refresh View (Option 3)
Simply refreshes the display to show latest data

#### 👋 Exit (Option 4)
Gracefully exits the application

## Dependencies

- **mongodb**: MongoDB driver for Node.js/Bun
- **typescript**: TypeScript language support
- **bun-types**: TypeScript types for Bun

## 🔧 Troubleshooting

### MongoDB connection issues
```bash
# Check if MongoDB container is running
docker ps

# View MongoDB logs
docker logs mongodb

# Restart MongoDB container
docker restart mongodb

# If container doesn't exist, create it
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

### Bun issues
```bash
# Update Bun to latest version
bun upgrade

# Check Bun version
bun --version

# Reinstall dependencies
rm -rf node_modules
bun install
```

### Permission issues on Linux
```bash
# Add user to docker group (Linux)
sudo usermod -aG docker $USER
# Log out and back in for changes to take effect
```

## 💡 Tips

1. **Data Persistence**: MongoDB data persists in Docker volume `mongodb_data`
2. **View MongoDB data directly**:
   ```bash
   docker exec -it mongodb mongosh
   use myapp
   db.users.find().pretty()
   ```

3. **Stop MongoDB container**:
   ```bash
   docker stop mongodb
   ```

4. **Start MongoDB container**:
   ```bash
   docker start mongodb
   ```

5. **Remove MongoDB container and data**:
   ```bash
   docker stop mongodb
   docker rm mongodb
   docker volume rm mongodb_data
   ```

## Contributing

Feel free to submit issues and enhancement requests!

## License

MIT License - feel free to use this project for learning and development.

2026 [ ivan deus ]
---

**Happy Coding!*
