export const addColumnToTableIfNotExists = ({
  tableName,
  columnName,
  columnType,
}: {
  tableName: string
  columnName: string
  columnType: string
}) => {
  return `
  SET @dbname = DATABASE();
  SET @tablename = '${tableName}';
  SET @columnname = '${columnName}';
  SET @preparedStatement = (SELECT IF(
    (
      SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
      WHERE
        (table_name = @tablename)
        AND (table_schema = @dbname)
        AND (column_name = @columnname)
    ) > 0,
    "SELECT 1",
    CONCAT("ALTER TABLE ", @tablename, " ADD ", @columnname, " ${columnType};")
  ));
  PREPARE alterIfNotExists FROM @preparedStatement;
  EXECUTE alterIfNotExists;
  DEALLOCATE PREPARE alterIfNotExists;
`
}
