mkdir data
node scripts/initializedDB.js data/lms.db 
mkdir test/data
node scripts/initializedDB.js test/data/lms.db
sqlite3 test/data/lms.db < scripts/insertData.sql
cp test/data/lms.db test/data/lms.db.backup