.PHONY: db-up db-down db-clean run down prod-build prod-up prod-down

# --- DEV ---
db-up:
	docker-compose -f docker-compose.dev.yml up -d db

db-down:
	docker-compose -f docker-compose.dev.yml stop db

db-clean:
	docker-compose -f docker-compose.dev.yml down db -v

run:
	docker-compose -f docker-compose.dev.yml up -d --build

down:
	docker-compose -f docker-compose.dev.yml down

# --- PROD ---
prod-build:
	docker-compose -f docker-compose.prod.yml build

prod-up:
	docker-compose -f docker-compose.prod.yml up -d

prod-down:
	docker-compose -f docker-compose.prod.yml down
