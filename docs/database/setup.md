# Updating Local Database with Database Dump

## Preparing the file

1. First, take the file you want to import and make a copy. This is for backup, but also for diff usage

2. Remove the DEFINER statements contained in the file. You can do this with the following sed command: (note: make sure to adjust the filenames of the .sql files for all the following commands)

<pre> sed -i 's/DEFINER=[^*]*\*/\*/g' dump-copy.sql </pre>

3. Make sure the definer statements were removed. Additionally, since the sed command can remove other lines, make sure that nothing else was removed through the use of diff:

<pre> diff original-dump.sql dump-copy.sql > diff.sql </pre>

4. Now run these this command to extract the **dump header**, the **dchpca_dchp_3 database**, and the **dump footer** from the database dump

<pre>
{
sed -n '/^-- MySQL dump/,/^-- Current Database: /p' dump-copy.sql
sed -n '/^-- Current Database: `dchpca_dchp_3`/,/^-- Current Database: `mysql`/p' dump-copy.sql
sed -n '/\/\*!40103 SET TIME_ZONE=@OLD_TIME_ZONE \*\/;/,$p' dump-copy.sql
} > dump-final.sql
</pre>

5. Now the file is ready for import

## Importing the file

1. Open MySQL Workbench

2. Save a backup of your current copy of the database just in case (go to server -> export and save it as a database dump)

3. Drop the current dchp database schema in your MySQL Workbench

4. Go to server -> import

5. Import from Self-Contained File

6. Press the `new` button when asked for default target schema, and fill it in with database name (this likely won't be used)

7. Press import

8. refresh schema display (should be in the top right of the sidebar. Alternatively, restart MySQL Workbench). The DCHP3 Database should now be visible

9. Start the server if necessary

10. Database successfully imported

## Troubleshooting

### Database `dchpca_dchp_3` does not exist on the database server at `127.0.0.1:3306`

Try going into MySQL Workbench. Change the name of the database in the .env file at the `DATABASE_URL` to the name that the database is in MySQL Workbench.

### The user specified as a definer ('root'@'127.0.0.1') does not exist

After successfully importing and running the database, this error may pop up when trying to click on an entry.

This shows up when you failed to properly delete the definer statements. Drop the dchp3 database schema and try importing again, and carefully verify that all definer statements have been deleted.
