#shebang
#!/bin/bash

#Variables
SOURCE_DIR="$1"

echo "$SOURCE_DIR"

#Validation check
if [ ! -d "$SOURCE_DIR" ]; then
	echo "Error: no directory found"
	exit 1
fi

#timestamp generation
TIMESTAMP=$(date +%Y-%m-%d_%H-%M-%S)

#filename generation
BACKUP_FILE="backup-$TIMESTAMP.tar.gz"

#zip the file but exclude node_modules
tar -czf "$BACKUP_FILE" --exclude='node_modules' "$SOURCE_DIR"

echo "Backup created: $BACKUP_FILE"
