#!/bin/bash
# Deploy script for Battleship Mini App

set -e

echo "🚢 Deploying Battleship Mini App..."

# Check if required files exist
if [ ! -f "index.html" ] || [ ! -f "game.js" ] || [ ! -f "styles.css" ]; then
    echo "❌ Error: Required files not found!"
    exit 1
fi

# Create deployment directory
DEPLOY_DIR="${DEPLOY_DIR:-./dist}"
mkdir -p "$DEPLOY_DIR"

# Copy files
echo "📦 Copying files..."
cp index.html "$DEPLOY_DIR/"
cp game.js "$DEPLOY_DIR/"
cp styles.css "$DEPLOY_DIR/"

# Optional: Minify files (requires uglify-js and clean-css-cli)
if command -v uglifyjs &> /dev/null; then
    echo "🔧 Minifying JavaScript..."
    uglifyjs game.js -o "$DEPLOY_DIR/game.min.js" -c -m
    sed -i 's/game\.js/game.min.js/' "$DEPLOY_DIR/index.html"
fi

if command -v cleancss &> /dev/null; then
    echo "🔧 Minifying CSS..."
    cleancss -o "$DEPLOY_DIR/styles.min.css" styles.css
    sed -i 's/styles\.css/styles.min.css/' "$DEPLOY_DIR/index.html"
fi

# Create archive
echo "📦 Creating archive..."
cd "$DEPLOY_DIR"
tar -czf ../battleship-miniapp.tar.gz *
cd ..

echo "✅ Deployment ready!"
echo "📁 Files in: $DEPLOY_DIR"
echo "📦 Archive: battleship-miniapp.tar.gz"
echo ""
echo "🚀 Next steps:"
echo "1. Upload files to your web server (HTTPS required)"
echo "2. Register Mini App with @BotFather using /newapp"
echo "3. Set WEBAPP_URL in .env"
echo "4. Run: python3 bot.py"
