-- Make comment field non-length-limited (from VARCHAR(1000))
ALTER TABLE det_entries MODIFY comment TEXT;
