.. _user_subpart_key_columns:

*********************************
`USER_SUBPART_KEY_COLUMNS`:index:
*********************************

The ``USER_SUBPART_KEY_COLUMNS`` view provides information about the key
columns of those partitioned tables which are subpartitioned that belong
to the current user.

.. tabularcolumns:: |\Y{0.3}|\Y{0.3}|\Y{0.4}|

=============== ============ =====================================================
Name            Type         Description
=============== ============ =====================================================
schema_name     TEXT         The name of the schema in which the table resides.
name            TEXT         The name of the table in which the column resides.
object_type     CHARACTER(5) For compatibility only; always TABLE.
column_name     TEXT         The name of the column on which the key is defined.
column_position INTEGER      1 for the first column; 2 for the second column, etc.
=============== ============ =====================================================
