-- The DCHP-1 drawings for the DCHP-1 archive.
--
-- The 1967 edition's 115 drawings were scanned for DCHP-1 Online in 2013 and
-- recorded there only as det_entries.image_file_name, served from a folder
-- (/dchp_images) that no copy of the old site on hand still has. The same
-- scans were uploaded into DCHP-3's det_images in May 2013 and live in the
-- image bucket, which the archive reads through IMAGE_BUCKET_PREFIX like
-- DCHP-3 does. This file copies those det_images rows into the archive,
-- matched by headword (three headwords are spelled differently in DCHP-3 and
-- are mapped by hand). Generated 2026-11-12 from the DCHP-3 database.
--
-- Not covered: bombardier, kayak ((1)) and tuque have an image_file_name in
-- the 1967 database but no scan in DCHP-3.
--
-- Run after archive-edition-lift.sql, on the DCHP-1 archive database only:
--   mysql dchpca_dchp1 < sql/dchp1-archive-images.sql
--
-- Idempotent: a path already present is skipped.

INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A Brock copper', '/uploads/entries/992/2013.05.23_13.14.38_image032.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Brock copper'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/992/2013.05.23_13.14.38_image032.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A Cape Ann', '/uploads/entries/10092/2013.05.23_13.19.51_image040.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Cape Ann (hat)'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/10092/2013.05.23_13.19.51_image040.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A Cape Island boat', '/uploads/entries/10093/2013.05.23_13.20.49_image042.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Cape Island boat'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/10093/2013.05.23_13.20.49_image042.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A Chilkat blanket', '/uploads/entries/1756/2013.05.23_13.25.41_image050.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Chilkat blanket'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1756/2013.05.23_13.25.41_image050.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/2238/2013.05.23_13.33.10_Creesyllabics.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Cree syllabics'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2238/2013.05.23_13.33.10_Creesyllabics.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A Durham boat', '/uploads/entries/2741/2013.05.23_13.41.01_image068.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Durham boat'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2741/2013.05.23_13.41.01_image068.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'An Indian hammer', '/uploads/entries/4387/2013.05.23_13.57.25_image090.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Indian hammer'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4387/2013.05.23_13.57.25_image090.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/4595/2013.05.23_13.59.57_image099.JPG', id, 1, NULL FROM det_entries WHERE headword = 'Johnny Canuck'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4595/2013.05.23_13.59.57_image099.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'L\'Assomption sashes', '/uploads/entries/4886/2013.05.23_14.12.04_image110.jpg', id, 1, NULL FROM det_entries WHERE headword = 'L\'Assomption sash'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4886/2013.05.23_14.12.04_image110.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/5544/2013.05.23_14.15.01_image115.JPG', id, 1, NULL FROM det_entries WHERE headword = 'Miss Canada'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5544/2013.05.23_14.15.01_image115.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A Montreal canoe', '/uploads/entries/5595/2013.05.23_14.18.05_image118.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Montreal canoe'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5595/2013.05.23_14.18.05_image118.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/5602/2013.05.23_14.18.51_image123.JPG', id, 1, NULL FROM det_entries WHERE headword = 'Montreal ship copper'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5602/2013.05.23_14.18.51_image123.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'The Nome hitch', '/uploads/entries/5953/2013.05.23_14.23.26_image132.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Nome hitch'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5953/2013.05.23_14.23.26_image132.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'An Ookpik', '/uploads/entries/6118/2013.05.23_14.25.21_image134.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Ookpik'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6118/2013.05.23_14.25.21_image134.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A Quebec heater', '/uploads/entries/6856/2013.05.23_14.48.13_image152.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Quebec heater'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6856/2013.05.23_14.48.13_image152.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/7051/2013.05.23_14.52.48_image158.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Red River cart'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7051/2013.05.23_14.52.48_image158.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/7214/2013.05.23_14.53.58_image160.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Robertson raft'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7214/2013.05.23_14.53.58_image160.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/7342/2013.05.23_14.55.30_image162.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Russell fence'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7342/2013.05.23_14.55.30_image162.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8988/2013.05.23_15.33.58_image205.JPG', id, 1, NULL FROM det_entries WHERE headword = 'Toonik'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8988/2013.05.23_15.33.58_image205.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A York boat', '/uploads/entries/9879/2013.05.23_15.41.21_image216.jpg', id, 1, NULL FROM det_entries WHERE headword = 'York boat'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/9879/2013.05.23_15.41.21_image216.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/9897/2013.05.23_15.42.15_image218.jpg', id, 1, NULL FROM det_entries WHERE headword = 'Yukon sled'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/9897/2013.05.23_15.42.15_image218.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'An airtight burner', '/uploads/entries/63/2013.05.23_12.33.44_image004.jpg', id, 1, NULL FROM det_entries WHERE headword = 'airtight burner'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/63/2013.05.23_12.33.44_image004.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/78/2013.05.23_12.35.05_image006.jpg', id, 1, NULL FROM det_entries WHERE headword = 'alligator'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/78/2013.05.23_12.35.05_image006.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/204/2013.05.22_14.13.01_atigi.jpg', id, 1, NULL FROM det_entries WHERE headword = 'atigi'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/204/2013.05.22_14.13.01_atigi.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A bank barn, seen from back and front', '/uploads/entries/343/2013.05.23_12.43.36_image012.jpg', id, 1, NULL FROM det_entries WHERE headword = 'bank barn'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/343/2013.05.23_12.43.36_image012.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A barber chair', '/uploads/entries/370/2013.05.23_12.57.29_image014.jpg', id, 1, NULL FROM det_entries WHERE headword = 'barber chair'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/370/2013.05.23_12.57.29_image014.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/433/2013.05.23_12.58.27_image017.jpg', id, 1, NULL FROM det_entries WHERE headword = 'bateau'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/433/2013.05.23_12.58.27_image017.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/481/2013.05.23_12.59.10_image019.jpg', id, 1, NULL FROM det_entries WHERE headword = 'beaver'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/481/2013.05.23_12.59.10_image019.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'One kind of beaver-press', '/uploads/entries/514/2013.05.23_13.00.52_image022.jpg', id, 1, NULL FROM det_entries WHERE headword = 'beaver-press'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/514/2013.05.23_13.00.52_image022.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/767/2013.05.23_13.06.02_image025.JPG', id, 1, NULL FROM det_entries WHERE headword = 'bob'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/767/2013.05.23_13.06.02_image025.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/10028/2013.05.24_11.56.43_image025.JPG', id, 1, NULL FROM det_entries WHERE headword = 'bobsleigh ((n.))'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/10028/2013.05.24_11.56.43_image025.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/820/2013.05.23_14.03.59_image029.JPG', id, 1, NULL FROM det_entries WHERE headword = 'boom ((1)) ((n.))'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/820/2013.05.23_14.03.59_image029.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/986/2013.05.23_13.13.47_image030.jpg', id, 1, NULL FROM det_entries WHERE headword = 'broad-axe'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/986/2013.05.23_13.13.47_image030.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A bull boat', '/uploads/entries/1147/2013.05.23_13.15.30_image034.jpg', id, 1, NULL FROM det_entries WHERE headword = 'bull boat'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1147/2013.05.23_13.15.30_image034.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/1317/2013.05.23_14.05.59_image037.JPG', id, 1, NULL FROM det_entries WHERE headword = 'cache ((n.))'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1317/2013.05.23_14.05.59_image037.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/1519/2013.05.23_13.19.00_image039.JPG', id, 1, NULL FROM det_entries WHERE headword = 'cant-hook'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1519/2013.05.23_13.19.00_image039.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/1526/2013.05.23_13.21.35_image045.JPG', id, 1, NULL FROM det_entries WHERE headword = 'capote'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1526/2013.05.23_13.21.35_image045.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/1566/2013.05.23_13.22.48_image047.JPG', id, 1, NULL FROM det_entries WHERE headword = 'cariole ((n.))'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1566/2013.05.23_13.22.48_image047.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A casse- tête', '/uploads/entries/1600/2013.05.23_17.18.28_casse-tete.jpg', id, 1, NULL FROM det_entries WHERE headword = 'casse-tête'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1600/2013.05.23_17.18.28_casse-tete.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A casse- tête à calumet', '/uploads/entries/1601/2013.05.23_17.19.36_casse_tete_a_calumet.jpg', id, 1, NULL FROM det_entries WHERE headword = 'casse-tête à calumet'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1601/2013.05.23_17.19.36_casse_tete_a_calumet.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/1784/2013.05.23_13.26.43_image052.jpg', id, 1, NULL FROM det_entries WHERE headword = 'chiploquorgan'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1784/2013.05.23_13.26.43_image052.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/1795/2013.05.23_13.27.20_image054.jpg', id, 1, NULL FROM det_entries WHERE headword = 'chock-and-log fence'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/1795/2013.05.23_13.27.20_image054.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/2157/2013.05.23_13.28.54_image057.JPG', id, 1, NULL FROM det_entries WHERE headword = 'coupstick'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2157/2013.05.23_13.28.54_image057.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/2206/2013.05.23_13.30.11_image059.JPG', id, 1, NULL FROM det_entries WHERE headword = 'cradle-basket'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2206/2013.05.23_13.30.11_image059.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A crooked knife', '/uploads/entries/2250/2013.05.23_13.34.23_image060.jpg', id, 1, NULL FROM det_entries WHERE headword = 'crooked knife'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2250/2013.05.23_13.34.23_image060.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/2327/2013.05.23_13.35.02_dag.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'dag'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2327/2013.05.23_13.35.02_dag.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/2358/2013.05.23_13.36.18_image062.jpg', id, 1, NULL FROM det_entries WHERE headword = 'deadfall ((n.))'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2358/2013.05.23_13.36.18_image062.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'Demoiselles', '/uploads/entries/2415/2013.05.23_13.37.24_image064.jpg', id, 1, NULL FROM det_entries WHERE headword = 'demoiselle'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2415/2013.05.23_13.37.24_image064.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'One kind of dog-sled', '/uploads/entries/2534/2013.05.23_13.38.23_image066.jpg', id, 1, NULL FROM det_entries WHERE headword = 'dog-sled'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2534/2013.05.23_13.38.23_image066.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/2733/2013.05.23_13.39.30_dugout_canoe.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'dugout'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2733/2013.05.23_13.39.30_dugout_canoe.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/2794/2013.05.23_13.41.48_image070.jpg', id, 1, NULL FROM det_entries WHERE headword = 'elevator'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2794/2013.05.23_13.41.48_image070.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/2936/2013.05.23_13.42.38_fan_hitch.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'fan hitch'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/2936/2013.05.23_13.42.38_fan_hitch.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/3010/2013.05.23_13.44.54_image072.jpg', id, 1, NULL FROM det_entries WHERE headword = 'fire-board'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/3010/2013.05.23_13.44.54_image072.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A goelette', '/uploads/entries/3459/2013.05.23_13.46.55_image074.jpg', id, 1, NULL FROM det_entries WHERE headword = 'goelette'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/3459/2013.05.23_13.46.55_image074.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/3648/2013.05.23_13.48.18_image077.JPG', id, 1, NULL FROM det_entries WHERE headword = 'grizzly'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/3648/2013.05.23_13.48.18_image077.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/3898/2013.05.23_13.49.46_herring_rake.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'herring-rake'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/3898/2013.05.23_13.49.46_herring_rake.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A high-lead system', '/uploads/entries/3923/2013.05.23_13.50.35_image078.jpg', id, 1, NULL FROM det_entries WHERE headword = 'high-lead system'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/3923/2013.05.23_13.50.35_image078.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/3962/2013.05.23_13.51.44_image080.jpg', id, 1, NULL FROM det_entries WHERE headword = 'hockey stick'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/3962/2013.05.23_13.51.44_image080.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/3966/2013.05.23_13.52.16_image083.JPG', id, 1, NULL FROM det_entries WHERE headword = 'hohoq'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/3966/2013.05.23_13.52.16_image083.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A holey dollar', '/uploads/entries/3972/2013.05.23_13.53.00_image084.jpg', id, 1, NULL FROM det_entries WHERE headword = 'holey dollar'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/3972/2013.05.23_13.53.00_image084.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A horse snowshoe', '/uploads/entries/4073/2013.05.23_13.54.03_image086.jpg', id, 1, NULL FROM det_entries WHERE headword = 'horse snowshoe'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4073/2013.05.23_13.54.03_image086.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/4253/2013.05.23_13.55.35_ice_chisels.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'ice-chisel'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4253/2013.05.23_13.55.35_ice_chisels.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'Inukshuks', '/uploads/entries/4514/2013.05.23_13.58.30_image092.jpg', id, 1, NULL FROM det_entries WHERE headword = 'inukshuk'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4514/2013.05.23_13.58.30_image092.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/4576/2013.05.23_13.59.11_jigger.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'jigger'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4576/2013.05.23_13.59.11_jigger.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A komatik', '/uploads/entries/4769/2013.05.23_14.07.48_image102.jpg', id, 1, NULL FROM det_entries WHERE headword = 'komatik ((n.))'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4769/2013.05.23_14.07.48_image102.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A kudlik', '/uploads/entries/4779/2013.05.23_14.08.40_image104.jpg', id, 1, NULL FROM det_entries WHERE headword = 'kudlik'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4779/2013.05.23_14.08.40_image104.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A lacrosse stick and ball', '/uploads/entries/4807/2013.05.23_14.09.42_image106.jpg', id, 1, NULL FROM det_entries WHERE headword = 'lacrosse stick'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4807/2013.05.23_14.09.42_image106.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/4881/2013.05.23_14.10.20_larrigan.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'larrigan'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/4881/2013.05.23_14.10.20_larrigan.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/5121/2013.05.23_14.13.32_longhouse.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'longhouse'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5121/2013.05.23_14.13.32_longhouse.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/5563/2013.05.23_14.15.56_image117.JPG', id, 1, NULL FROM det_entries WHERE headword = 'moccasin'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5563/2013.05.23_14.15.56_image117.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A motor toboggan', '/uploads/entries/5681/2013.05.23_14.20.00_image124.jpg', id, 1, NULL FROM det_entries WHERE headword = 'motor toboggan'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5681/2013.05.23_14.20.00_image124.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/5761/2013.05.23_14.21.08_image127.JPG', id, 1, NULL FROM det_entries WHERE headword = 'mukluk'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5761/2013.05.23_14.21.08_image127.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A muskimoot', '/uploads/entries/5812/2013.05.23_14.22.11_image130.jpg', id, 1, NULL FROM det_entries WHERE headword = 'muskimoot'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/5812/2013.05.23_14.22.11_image130.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'An ooloo', '/uploads/entries/6124/2013.05.23_14.26.03_image136.jpg', id, 1, NULL FROM det_entries WHERE headword = 'ooloo'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6124/2013.05.23_14.26.03_image136.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'An oomiak', '/uploads/entries/6125/2013.05.23_14.26.52_image138.jpg', id, 1, NULL FROM det_entries WHERE headword = 'oomiak'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6125/2013.05.23_14.26.52_image138.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/6300/2013.05.23_14.41.21_image141.JPG', id, 1, NULL FROM det_entries WHERE headword = 'parfleche'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6300/2013.05.23_14.41.21_image141.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/6385/2013.05.23_14.42.20_image142.jpg', id, 1, NULL FROM det_entries WHERE headword = 'peavey'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6385/2013.05.23_14.42.20_image142.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/6452/2013.05.23_14.43.30_pikepole.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'pike-pole'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6452/2013.05.23_14.43.30_pikepole.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/6524/2013.05.23_14.44.22_image147.JPG', id, 1, NULL FROM det_entries WHERE headword = 'plank house'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6524/2013.05.23_14.44.22_image147.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/6553/2013.05.23_14.45.40_image149.JPG', id, 1, NULL FROM det_entries WHERE headword = 'pointer'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6553/2013.05.23_14.45.40_image149.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A pulphook', '/uploads/entries/6807/2013.05.23_14.47.16_image150.jpg', id, 1, NULL FROM det_entries WHERE headword = 'pulphook'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6807/2013.05.23_14.47.16_image150.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/6902/2013.05.23_14.49.19_image154.jpg', id, 1, NULL FROM det_entries WHERE headword = 'raft ((n.))'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6902/2013.05.23_14.49.19_image154.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/6916/2013.05.23_14.51.45_image156.jpg', id, 1, NULL FROM det_entries WHERE headword = 'rail fence'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/6916/2013.05.23_14.51.45_image156.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A sawyer\'s fence', '/uploads/entries/7480/2013.05.23_14.57.32_image164.jpg', id, 1, NULL FROM det_entries WHERE headword = 'sawyer\'s fence'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7480/2013.05.23_14.57.32_image164.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/7524/2013.05.23_14.58.14_image166.jpg', id, 1, NULL FROM det_entries WHERE headword = 'scoop roof'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7524/2013.05.23_14.58.14_image166.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/7526/2013.05.23_14.59.00_image168.jpg', id, 1, NULL FROM det_entries WHERE headword = 'scoot'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7526/2013.05.23_14.59.00_image168.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A scow', '/uploads/entries/7538/2013.05.23_14.59.41_image170.jpg', id, 1, NULL FROM det_entries WHERE headword = 'scow '
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7538/2013.05.23_14.59.41_image170.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/7707/2013.05.23_15.02.44_image173.JPG', id, 1, NULL FROM det_entries WHERE headword = 'shanty ((n.))'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7707/2013.05.23_15.02.44_image173.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A shay', '/uploads/entries/7735/2013.05.23_15.13.13_image174.jpg', id, 1, NULL FROM det_entries WHERE headword = 'shay'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7735/2013.05.23_15.13.13_image174.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/7782/2013.05.23_15.14.12_image176.jpg', id, 1, NULL FROM det_entries WHERE headword = 'shishiquoi'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7782/2013.05.23_15.14.12_image176.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A skyline system', '/uploads/entries/7983/2013.05.23_15.15.23_image178.jpg', id, 1, NULL FROM det_entries WHERE headword = 'skyline'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/7983/2013.05.23_15.15.23_image178.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8006/2013.05.23_15.16.01_sled_dog.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'sled dog '
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8006/2013.05.23_15.16.01_sled_dog.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8085/2013.05.23_15.17.02_image184.jpg', id, 1, NULL FROM det_entries WHERE headword = 'sluice-box'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8085/2013.05.23_15.17.02_image184.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'Snow goggles', '/uploads/entries/8182/2013.05.23_15.17.39_image186.jpg', id, 1, NULL FROM det_entries WHERE headword = 'snow goggles'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8182/2013.05.23_15.17.39_image186.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'Snowshoes', '/uploads/entries/8207/2013.05.23_15.19.01_image188.jpg', id, 1, NULL FROM det_entries WHERE headword = 'snowshoe ((n.)) '
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8207/2013.05.23_15.19.01_image188.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8221/2013.05.23_15.19.33_snowshoe_needle.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'snowshoe needle'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8221/2013.05.23_15.19.33_snowshoe_needle.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8230/2013.05.23_15.20.48_snowsnake.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'snowsnake '
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8230/2013.05.23_15.20.48_snowsnake.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8514/2013.05.23_15.21.58_image190.jpg', id, 1, NULL FROM det_entries WHERE headword = 'stoneboat'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8514/2013.05.23_15.21.58_image190.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8552/2013.05.23_15.22.36_image192.jpg', id, 1, NULL FROM det_entries WHERE headword = 'stretcher'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8552/2013.05.23_15.22.36_image192.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT 'A sturgeon-nosed canoe', '/uploads/entries/8605/2013.05.23_15.23.27_image194.jpg', id, 1, NULL FROM det_entries WHERE headword = 'sturgeon-nosed canoe'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8605/2013.05.23_15.23.27_image194.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8779/2013.05.23_15.24.23_tandem_hitch.jpg', id, 0.25, NULL FROM det_entries WHERE headword = 'tandem hitch'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8779/2013.05.23_15.24.23_tandem_hitch.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8856/2013.05.23_15.29.55_image196.jpg', id, 1, NULL FROM det_entries WHERE headword = 'thunderbird'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8856/2013.05.23_15.29.55_image196.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8880/2013.05.23_15.30.51_image198.jpg', id, 1, NULL FROM det_entries WHERE headword = 'tilt'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8880/2013.05.23_15.30.51_image198.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8943/2013.05.23_15.31.56_image200.jpg', id, 1, NULL FROM det_entries WHERE headword = 'tip-up'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8943/2013.05.23_15.31.56_image200.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/8947/2013.05.23_15.32.51_image202.jpg', id, 1, NULL FROM det_entries WHERE headword = 'toboggan ((n.)) '
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/8947/2013.05.23_15.32.51_image202.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/9151/2013.05.23_15.35.28_image206.jpg', id, 1, NULL FROM det_entries WHERE headword = 'travois'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/9151/2013.05.23_15.35.28_image206.jpg');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/9227/2013.05.23_15.36.30_tump.JPG', id, 0.25, NULL FROM det_entries WHERE headword = 'tumpline'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/9227/2013.05.23_15.36.30_tump.JPG');
INSERT INTO det_images (caption, path, entry_id, scale, `order`)
  SELECT NULL, '/uploads/entries/9482/2013.05.23_15.38.51_image214.jpg', id, 1, NULL FROM det_entries WHERE headword = 'water-drum'
  AND NOT EXISTS (SELECT 1 FROM det_images x WHERE x.path = '/uploads/entries/9482/2013.05.23_15.38.51_image214.jpg');
