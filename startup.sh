#!/bin/bash
# entrypoint.sh
echo "Container is ready. Use docker exec to run your script."
cat README.md
tail -f /dev/null
