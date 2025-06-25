🛠 **Drizzle ORM Migration Commands**
Drizzle ORM uses CLI commands to help manage your database schema in a structured and safe way. Below are the key commands you'll need:

**npx drizzle-kit generate**
This command compares your current model files (usually in *.model.ts) with the existing database schema and generates a new SQL migration file. Use this command after modifying your models, such as adding or removing columns or tables. The generated migration file will be saved in the drizzle/migrations directory.

**npx drizzle-kit push**
This command takes the latest schema changes from your models and applies them directly to the database. It's useful during *development* when you want quick schema syncing without managing migration files manually. Note: This does not track migration history and should not be used in production.

**npx drizzle-kit migrate**
This command runs all pending migration files (stored in the drizzle/migrations directory) and applies them to the database. It also keeps track of what has already been applied, ensuring safe and repeatable schema updates. Use this in *staging* or *production* environments where controlled migrations are necessary.

💡 Always use generate to create versioned migration files, commit them to your repo, and use migrate in deployment environments.