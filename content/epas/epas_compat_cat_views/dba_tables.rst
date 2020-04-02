.. _dba_tables:

*******************
`DBA_TABLES`:index:
*******************

The ``DBA_TABLES`` view provides information about all tables in the
database.

.. tabularcolumns:: |\Y{0.3}|\Y{0.3}|\Y{0.4}|

=============== ==================== =======================================================================================
Name            Type                 Description
owner           TEXT                 User name of the table’s owner.
schema_name     TEXT                 Name of the schema in which the table belongs.
table_name      TEXT                 Name of the table.
tablespace_name TEXT                 Name of the tablespace in which the table resides if other than the default tablespace.
status          CHARACTER VARYING(5) Included for compatibility only; always set to VALID.
temporary       CHARACTER(1)         Y if the table is temporary; N if the table is permanent.
=============== ==================== =======================================================================================
