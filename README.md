# tsense backend

This is the tsense backend. It is a simple REST API that stores and retrieves sensor measurements.

## Example usage

```bash
# Read config
curl http://localhost:3000/config/measurements -H "Content-Type: application/json"

# Read measurement
curl http://localhost:3000/measurements -H "Content-Type: application/json"

# Write measurement
curl -X POST http://localhost:3000/measurements -H "Content-Type: application/json" -d '{
"mac": "A4:C1:38:C5:45:49", "t": -23.1, "h": 1}'
```
