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

echo "$TIMESTAMP"
