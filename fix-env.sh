#!/bin/bash
echo "🔧 Fixing DATABASE_URL in .env file..."

# Backup the current .env file
cp .env .env.backup 2>/dev/null || true

# MongoDB connection string
MONGO_URL="mongodb+srv://23bcs037:2PNRnxkGdUPdjv4r@cluster0.q5kwrtg.mongodb.net/hey-attrangi?retryWrites=true&w=majority"

# Check if .env exists
if [ ! -f .env ]; then
    echo "Creating new .env file..."
    cat > .env << ENVFILE
DATABASE_URL="${MONGO_URL}"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
RAZORPAY_KEY_ID=""
RAZORPAY_KEY_SECRET=""
ENVFILE
else
    echo "Updating existing .env file..."
    # Replace DATABASE_URL line
    if grep -q "^DATABASE_URL=" .env; then
        sed -i "s|^DATABASE_URL=.*|DATABASE_URL=\"${MONGO_URL}\"|" .env
    else
        # Add DATABASE_URL at the beginning
        sed -i "1i DATABASE_URL=\"${MONGO_URL}\"" .env
    fi
fi

echo "✅ DATABASE_URL updated successfully!"
echo "📝 Backup saved to .env.backup"
