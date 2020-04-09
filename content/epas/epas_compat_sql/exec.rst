.. _exec:

*************
`EXEC`:index:
*************

**Name**

``EXEC``

**Synopsis**

.. code-block:: text

    EXEC function_name ['('[argument_list]')']

**Description**

``EXECUTE``

**Parameters**

``procedure_name``

    The (optionally schema-qualified) function name.

``argument_list``

   ``argument_list`` specifies a comma-separated list of arguments
   required by the function. Note that each member of ``argument_list``
   corresponds to a formal argument expected by the function. Each
   formal argument may be an ``IN`` parameter, an ``OUT`` parameter, or an ``INOUT``
   parameter.

**Examples**

The ``EXEC`` statement may take one of several forms, depending on the
arguments required by the function:

.. code-block:: text

    EXEC update_balance;
    EXEC update_balance();
    EXEC update_balance(1,2,3);
