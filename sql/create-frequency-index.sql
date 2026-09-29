-- Tables for the Frequency Index tool (issue #482).
-- Run once by hand on each environment; there is no Prisma migration workflow.
-- Matches the FrequencyNormalizerCount, FrequencyLookup and FrequencyLookupRow
-- models in prisma/schema.prisma.
--
-- A normalizer count is an observation in its own right: "the" on .ca gave
-- N hits on a date. It is stored once, in det_frequency_normalizer_counts,
-- whether it was read during a term lookup, reused by a later lookup, or
-- loaded from a spreadsheet. Lookup rows point at the observation they used
-- and store nothing derived: the index is computed when read, so correcting
-- an observation corrects every lookup that used it.

CREATE TABLE det_frequency_lookups (
  id         INT          NOT NULL AUTO_INCREMENT,
  term       VARCHAR(255) NOT NULL,
  normalizer VARCHAR(100) NOT NULL,
  exclusions VARCHAR(500) NULL,
  multiplier INT          NOT NULL,
  backend    VARCHAR(50)  NOT NULL,
  hl         VARCHAR(10)  NULL,
  gl         VARCHAR(10)  NULL,
  user_id    INT          NOT NULL,
  created    DATETIME     NOT NULL,
  -- Set when the counts or multiplier are corrected after saving.
  updated         DATETIME NULL,
  updated_user_id INT      NULL,
  PRIMARY KEY (id),
  KEY frequency_lookup_term_idx (term),
  KEY frequency_lookup_user_idx (user_id),
  KEY frequency_lookup_normalizer_idx (normalizer),
  CONSTRAINT det_frequency_lookups_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT det_frequency_lookups_updated_user_id_fkey
    FOREIGN KEY (updated_user_id) REFERENCES user (id) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE det_frequency_normalizer_counts (
  id         INT          NOT NULL AUTO_INCREMENT,
  normalizer VARCHAR(100) NOT NULL,
  domain_key VARCHAR(20)  NOT NULL,
  hits       BIGINT       NOT NULL,
  observed   DATE         NOT NULL,
  -- "lookup" when read during a term lookup, otherwise where it came from,
  -- e.g. "spreadsheet".
  source     VARCHAR(100) NOT NULL,
  -- The lookup it was read during, if any. Null for imported counts, and
  -- after that lookup is deleted while another still uses the count.
  lookup_id  INT          NULL,
  user_id    INT          NOT NULL,
  created    DATETIME     NOT NULL,
  updated         DATETIME NULL,
  updated_user_id INT      NULL,
  PRIMARY KEY (id),
  KEY frequency_normalizer_count_series_idx (normalizer, domain_key, observed),
  KEY frequency_normalizer_count_lookup_idx (lookup_id),
  CONSTRAINT det_frequency_normalizer_counts_lookup_id_fkey
    FOREIGN KEY (lookup_id) REFERENCES det_frequency_lookups (id) ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT det_frequency_normalizer_counts_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT det_frequency_normalizer_counts_updated_user_id_fkey
    FOREIGN KEY (updated_user_id) REFERENCES user (id) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE det_frequency_lookup_rows (
  id                  INT           NOT NULL AUTO_INCREMENT,
  lookup_id           INT           NOT NULL,
  domain_key          VARCHAR(20)   NOT NULL,
  domain_label        VARCHAR(50)   NOT NULL,
  site_clause         VARCHAR(255)  NOT NULL,
  term_query          VARCHAR(1000) NOT NULL,
  term_hits           BIGINT        NOT NULL,
  normalizer_count_id INT           NOT NULL,
  PRIMARY KEY (id),
  KEY frequency_lookup_row_lookup_idx (lookup_id),
  KEY frequency_lookup_row_count_idx (normalizer_count_id),
  CONSTRAINT det_frequency_lookup_rows_lookup_id_fkey
    FOREIGN KEY (lookup_id) REFERENCES det_frequency_lookups (id) ON DELETE CASCADE ON UPDATE CASCADE,
  -- An observation in use cannot be deleted; delete or repoint the rows first.
  CONSTRAINT det_frequency_lookup_rows_normalizer_count_id_fkey
    FOREIGN KEY (normalizer_count_id) REFERENCES det_frequency_normalizer_counts (id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
