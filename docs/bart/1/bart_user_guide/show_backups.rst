.. raw:: latex

    \newpage

.. show_backups:

.. index:: SHOW-BACKUPS Subcommand

************
SHOW-BACKUPS
************

The ``SHOW-BACKUPS`` subcommand displays the backup information for the
managed database servers. To view examples of ``SHOW-BACKUPS`` subcommand,
see the *EDB Postgres Backup and Recovery Reference Guide* available at:

   `<https://www.enterprisedb.com/edb-docs/>`_

**Syntax:**

.. code-block:: text

    bart SHOW-BACKUPS [ –s { <server_name> | all } ]
      [ -i { <backup_id> | <backup_name> | all } ]
      [ -t ]

**Options**

-  ``-s or --server { <server_name> | all }``

   -  ``<server_name>`` is the name of the database server whose backup
      information is to be displayed.

   -  If ``all`` is specified or if the option is omitted, the backup
      information for all database servers is displayed with the exception
      as described by the following note:

    .. note::

      If ``SHOW-BACKUPS`` is invoked while the BART ``BACKUP``
      subcommand is in progress, backups affected by the backup process
      are shown in progress status in the displayed backup information.

-  ``-i or --backupid { <backup_id> | <backup_name> | all }``

   ``<backup_id>`` is a backup identifier.

   ``<backup_name>`` is the user-defined alphanumeric name for the backup.

   If ``all`` is specified or if the option is omitted, all backup information for the relevant database server is displayed.

-  ``-t`` or ``–toggle``

  Displays more backup information in a list format. If the option is
  omitted, the default is a tabular format.
