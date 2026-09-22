-- Tables for the Frequency Index tool (issue #482).
-- Run once by hand on each environment; there is no Prisma migration workflow.
-- Matches the FrequencyLookup and FrequencyLookupRow models in prisma/schema.prisma.

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
  PRIMARY KEY (id),
  KEY frequency_lookup_term_idx (term),
  KEY frequency_lookup_user_idx (user_id),
  CONSTRAINT det_frequency_lookups_user_id_fkey
    FOREIGN KEY (user_id) REFERENCES user (id) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE det_frequency_lookup_rows (
  id                        INT           NOT NULL AUTO_INCREMENT,
  lookup_id                 INT           NOT NULL,
  domain_key                VARCHAR(20)   NOT NULL,
  domain_label              VARCHAR(50)   NOT NULL,
  site_clause               VARCHAR(255)  NOT NULL,
  term_query                VARCHAR(1000) NOT NULL,
  normalizer_query          VARCHAR(500)  NOT NULL,
  term_hits                 BIGINT        NOT NULL,
  normalizer_hits           BIGINT        NOT NULL,
  frequency_index           DOUBLE        NOT NULL,
  normalizer_reused_from_id INT           NULL,
  PRIMARY KEY (id),
  KEY frequency_lookup_row_lookup_idx (lookup_id),
  CONSTRAINT det_frequency_lookup_rows_lookup_id_fkey
    FOREIGN KEY (lookup_id) REFERENCES det_frequency_lookups (id) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
