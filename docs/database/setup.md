# Updating Local Database with Database Dump

## Brief Instructions

1. Save a backup of the current database (go to server -> export and save it as a database dump)

2. Go to server -> import

3. Import from Self-Contained File

4. Press the `new` button when asked for default target schema, and fill it in with database name

5. import

6. refresh schema display (should be in the top right of the sidebar. Or just restart MySQL Workbench)

7. Server should be started. Try to run server under the server tab if it isn't.

## Database `dchpca_dchp_3` does not exist on the database server at `127.0.0.1:3306`

Try going into MySQL Workbench. Change the name of the database in the .env file at the `DATABASE_URL` to the name that the database is in MySQL Workbench.

## Database Name needs to be adjusted

If you go through the dump file, you can adjust the database name in the dump itself.

Do a ctrl+f on the database name, and then edit all the lines that look like the following:

- -- Current Database: `old-name`
- CREATE DATABASE /\_!32312 IF NOT EXISTS\_/ `old-name` /\_!40100 DEFAULT CHARACTER SET latin1 \_/ /\_!80016 DEFAULT ENCRYPTION='N' \_/;
- use `old-name`

## Authentication failed against database server at `127.0.0.1`, the provided database credentials for `root` are not valid

This error pops up when your credentials aren't valid.

1. fix your credentials in the .env file in the database URL and ensure they're correct
2. Try opening the database in MySQL Workbench. If this fails, this may be a deeper problem listed as below

## Access denied for user 'root'@'localhost' (using password: YES)

For some reason, importing the database dump into MySQL Workbench can result in this error popping up. This error emerges after trying to login to the databaset through MySQL Workbench using your root user and password. (This error doesn't always pop up immediately-- it occured for me an hour after reinstalling and correctly getting the database running again. Maybe because I opened MySQL Workbench to edit a .SQL file).

Unfortunately, there isn't one specific solution to this. I had to uninstall and reinstall MySQL as a whole to fix this. (Note: I used the MySQL Installer, not the MySQL Workbench installer) There are many other solutions online, but need to be tried out on a case-by-case basis.

Some things to verify:

1. Make sure your password is correct in the .env file
2. see if you can access MySQL at all through the command line by running `mysql`
3. see if you can login to the server through the command line by running `mysql -u root -p`

## MySQL Workbench unable to start server without crashing

try using MySQL Installer to uninstall MySQL Server and Reinstall it (the same version that was uninstalled). Then, re-import the data from the dump.

## The user specified as a definer ('root'@'127.0.0.1') does not exist

After successfully importing and running the database, this error may pop up when trying to click on an entry.

Workaround: Go through the database dump and delete all the `definer` statements and save this as an alternate script. Use this script to import the database dump.

---

NEW CONTENT:

Run the first sed command in bash, then run the second sed command.

Remove definer statements:

sed -i 's/DEFINER=[^*]\*\*/\*/g' all-databases-2024-10-31_09-31-25.sql

Extract dump headers, and then extract database dchpca_dchp_3

{
sed -n '/^-- MySQL dump/,/^-- Current Database: /p' all-databases-2024-10-31_09-31-25.sql
sed -n '/^-- Current Database: `dchpca_dchp_3`/,/^-- Current Database: `mysql`/p' all-databases-2024-10-31_09-31-25.sql
} > dchp3-isolated-database-dump.sql

Notes on both:

1. you need to remove the definer statements otherwise weird errors will pop up
2. the second script does two things: first, it preserves a bunch of necessary header information. Content that looks like the attached photo is necessary to ensure the dump is imported smoothly. Second, it extracts only the database you want (dchpca_dchp_3).
3. after running these commands you should be good to go!

![header info for database](image.png)

{
sed -n '/^-- MySQL dump/,/^-- Current Database: /p' all-databases-2024-10-31_09-31-25-copy.sql
sed -n '/^-- Current Database: `dchpca_dchp_3`/,/^-- Current Database: `mysql`/p' all-databases-2024-10-31_09-31-25-copy.sql
} > dchp3-isolated-database-dump.sql
