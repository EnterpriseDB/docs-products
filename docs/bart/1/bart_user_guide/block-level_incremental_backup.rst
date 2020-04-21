.. raw:: latex

    \newpage

.. _block-level_incremental_backup:

***************************************
`Block-Level Incremental Backup`:index:
***************************************

This section describes the basic concepts of a block-level incremental
backup (referred to as an incremental backup). An incremental backup is functionality unique to BART.

An incremental backup provides a number of advantages when compared to
using a full backup:

-  The amount of time required to produce an incremental backup is
   generally less than a full backup, as modified relation blocks are
   saved instead of all full relation files of the database cluster.

-  An incremental backup uses less disk space than a full backup.

Generally, all BART features (such as retention policy management) apply
to incremental backups as well as full backups. See 
`Managing Incremental Backups <managing_incremental_backups>`_ for information about retention policy management as applied to incremental backups.


.. toctree::
   :maxdepth: 3

   incremental_backup_limitations_and_requirements
   concept_overview
   wal_scanning_preparation_for_an_incremental_backup
   performing_an_incremental_backup
   restoring_an_incremental_backup
