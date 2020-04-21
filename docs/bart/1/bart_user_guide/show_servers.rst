.. raw:: latex

    \newpage

.. _show_servers:

.. index:: SHOW-SERVERS Subcommand

************
SHOW-SERVERS
************

The ``SHOW-SERVERS`` subcommand displays the information for the managed
database servers listed in the BART configuration file. To view examples
of ``SHOW-SERVERS`` subcommand, see the *EDB Postgres Backup and Recovery
Reference Guide* available at:

   `<https://www.enterprisedb.com/edb-docs/>`_

**Syntax:**

    ``bart SHOW-SERVERS [ –s { <server_name> | all } ]``

**Options**

``-s { <server_name> | all }`` or ``--server { <server_name> | all }``

``<server_name>`` is the name of the database server whose BART
configuration information is to be displayed. If ``all`` is specified or if
the option is omitted, information for all database servers is
displayed.
