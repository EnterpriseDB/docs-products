.. _all_tables:

*******************
`ALL_TABLES`:index:
*******************

The ``ALL_TABLES`` view provides information on all user-defined tables.

.. tabularcolumns:: |\Y{0.3}|\Y{0.3}|\Y{0.4}|

=============== ==================== ================================================================================================================
Name            Type                 Description
owner           TEXT                 User name of the table’s owner.
schema_name     TEXT                 Name of the schema in which the table belongs.
table_name      TEXT                 Name of the table.
tablespace_name TEXT                 Name of the tablespace in which the table resides if other than the default tablespace.
status          CHARACTER VARYING(5) Whether or not the state of the table is valid. Currently, Included for compatibility only; always set to VALID.
temporary       CHARACTER(1)         Y if this is a temporary table; N if this is not a temporary table.
=============== ==================== ================================================================================================================
