.. _create_trigger:

***********************
`CREATE TRIGGER`:index:
***********************

**Name**

``CREATE TRIGGER --`` define a simple trigger

**Synopsis**

.. code-block:: text

    CREATE [ OR REPLACE ] TRIGGER name
      { BEFORE | AFTER | INSTEAD OF }
      { INSERT | UPDATE | DELETE | TRUNCATE }
          [ OR { INSERT | UPDATE | DELETE | TRUNCATE} ] [, ...]
        ON table
      [ REFERENCING { OLD AS old | NEW AS new } ...]
      [ FOR EACH ROW ]
      [ WHEN condition ]
      [ DECLARE
          [ PRAGMA AUTONOMOUS_TRANSACTION; ]
          declaration; [, ...] ]
        BEGIN
          statement; [, ...]
      [ EXCEPTION
        { WHEN exception [ OR exception ] [...] THEN
            statement; [, ...] } [, ...]
      ]
        END

**Name**

``CREATE TRIGGER --`` define a compound trigger

**Synopsis**

.. code-block:: text

    CREATE [ OR REPLACE ] TRIGGER name
      FOR { INSERT | UPDATE | DELETE | TRUNCATE }
    	 [ OR { INSERT | UPDATE | DELETE | TRUNCATE } ] [, ...]
    	    ON table
       [ REFERENCING { OLD AS old | NEW AS new } ...]
       [ WHEN condition ]
       COMPOUND TRIGGER
       [ private_declaration; ] ...
       [ procedure_or_function_definition ] ...
       compound_trigger_definition
        END

Where ``private_declaration`` is an identifier of a private variable that
can be accessed by any procedure or function. There can be zero, one, or
more private variables. ``private_declaration`` can be any of the
following:

    -  Variable Declaration

    -  Record Declaration

    -  Collection Declaration

    -  REF CURSOR and Cursor Variable Declaration

    -  TYPE Definitions for Records, Collections, and REF CURSORs

    -  Exception

    -  Object Variable Declaration

Where ``procedure_or_function_definition`` :=

.. code-block:: text

   procedure_definition | function_definition

Where ``procedure_definition`` :=

.. code-block:: text

    PROCEDURE proc_name[ argument_list ]
      [ options_list ]
      { IS | AS }
        procedure_body
      END [ proc_name ] ;

Where ``procedure_body`` :=

.. code-block:: text

    [ declaration; ] [, ...]
    BEGIN
      statement; [...]
    [ EXCEPTION
       { WHEN exception [OR exception] [...]] THEN statement; }
       [...]
    ]

Where ``function_definition`` :=

.. code-block:: text

    FUNCTION func_name [ argument_list ]
      RETURN rettype [ DETERMINISTIC ]
      [ options_list ]
      { IS | AS }
        function_body
      END [ func_name ] ;

Where ``function_body`` :=

.. code-block:: text

    [ declaration; ] [, ...]
    BEGIN
      statement; [...]
    [ EXCEPTION
      { WHEN exception [ OR exception ] [...] THEN statement; }
      [...]
    ]

Where ``compound_trigger_definition`` is:

.. code-block:: text

    { compound_trigger_event } { IS | AS }
      compound_trigger_body
    END [ compound_trigger_event ] [ ... ]

Where ``compound_trigger_event`` :=

.. code-block:: text

    [ BEFORE STATEMENT | BEFORE EACH ROW | AFTER EACH ROW |
      AFTER STATEMENT  | INSTEAD OF EACH ROW ]

Where ``compound_trigger_body`` :=

.. code-block:: text

    [ declaration; ] [, ...]
    BEGIN
      statement; [...]
    [ EXCEPTION
       { WHEN exception [OR exception] [...] THEN statement; }
       [...]
    ]

**Description**

``CREATE TRIGGER`` defines a new trigger. ``CREATE OR REPLACE TRIGGER`` will
either create a new trigger, or replace an existing definition.

If you are using the ``CREATE TRIGGER`` keywords to create a new trigger,
the name of the new trigger must not match any existing trigger defined
on the same table. New triggers will be created in the same schema as
the table on which the triggering event is defined.

If you are updating the definition of an existing trigger, use the
``CREATE OR REPLACE TRIGGER`` keywords.

When you use syntax that is compatible with Oracle to create a trigger,
the trigger runs as a ``SECURITY DEFINER`` function.

**Parameters**

``name``

    The name of the trigger to create.

``BEFORE | AFTER``

    Determines whether the trigger is fired before or after the triggering
    event.

``INSTEAD OF``

    ``INSTEAD OF`` trigger modifies an updatable view; the trigger will execute
    to update the underlying table(s) appropriately. The ``INSTEAD OF`` trigger
    is executed for each row of the view that is updated or modified.

``INSERT | UPDATE | DELETE | TRUNCATE``

    Defines the triggering event.

``table``

    The name of the table or view on which the triggering event occurs.

``condition``

   ``condition`` is a Boolean expression that determines if the trigger
   will actually be executed; if ``condition`` evaluates to ``TRUE``, the
   trigger will fire.

   If the trigger definition includes the ``FOR EACH ROW`` keywords, the
   ``WHEN`` clause can refer to columns of the old and/or new row values by
   writing ``OLD.column_name`` or ``NEW.column_name`` respectively.
   ``INSERT`` triggers cannot refer to ``OLD`` and ``DELETE`` triggers cannot refer
   to ``NEW``.

   If the trigger includes the ``INSTEAD OF`` keywords, it may not include a
   ``WHEN`` clause. A ``WHEN`` clause cannot contain subqueries.

``REFERENCING { OLD AS old | NEW AS new } ...``

    ``REFERENCING`` clause to reference old rows and new rows, but restricted in
    that *old* may only be replaced by an identifier named old or any
    equivalent that is saved in all lowercase (for example, ``REFERENCING OLD
    AS old``, ``REFERENCING OLD AS OLD``, or ``REFERENCING OLD AS "old"``). Also,
    ``new`` may only be replaced by an identifier named new or any equivalent
    that is saved in all lowercase (for example, ``REFERENCING NEW AS new``,
    ``REFERENCING NEW AS NEW``, or ``REFERENCING NEW AS "new"``).

    Either one, or both phrases ``OLD AS old`` and ``NEW AS new`` may be
    specified in the ``REFERENCING`` clause (for example, ``REFERENCING NEW AS New
    OLD AS Old``).

    This clause is not compatible with Oracle databases in that identifiers
    other than ``old`` or ``new`` may not be used.

``FOR EACH ROW``

    Determines whether the trigger should be fired once for every row
    affected by the triggering event, or just once per SQL statement. If
    specified, the trigger is fired once for every affected row (row-level
    trigger), otherwise the trigger is a statement-level trigger.

``PRAGMA AUTONOMOUS_TRANSACTION``

    ``PRAGMA AUTONOMOUS_TRANSACTION`` is the directive that sets the trigger as
    an autonomous transaction.

``declaration``

    A variable, type, ``REF CURSOR``, or subprogram declaration. If subprogram
    declarations are included, they must be declared after all other
    variable, type, and ``REF CURSOR`` declarations.

``statement``

    An SPL program statement. Note that a ``DECLARE - BEGIN - END`` block is
    considered an SPL statement unto itself. Thus, the trigger body may
    contain nested blocks.

``exception``

    An exception condition name such as ``NO_DATA_FOUND``, ``OTHERS``, etc.

**Examples**

The following is a statement-level trigger that fires after the
triggering statement (insert, update, or delete on table ``emp``) is
executed.

.. code-block:: text

    CREATE OR REPLACE TRIGGER user_audit_trig
        AFTER INSERT OR UPDATE OR DELETE ON emp
    DECLARE
        v_action        VARCHAR2(24);
    BEGIN
        IF INSERTING THEN
            v_action := ' added employee(s) on ';
        ELSIF UPDATING THEN
            v_action := ' updated employee(s) on ';
        ELSIF DELETING THEN
            v_action := ' deleted employee(s) on ';
        END IF;
        DBMS_OUTPUT.PUT_LINE('User ' || USER || v_action ||
            TO_CHAR(SYSDATE,'YYYY-MM-DD'));
    END;

The following is a row-level trigger that fires before each row is
either inserted, updated, or deleted on table ``emp``.

.. code-block:: text

    CREATE OR REPLACE TRIGGER emp_sal_trig
        BEFORE DELETE OR INSERT OR UPDATE ON emp
        FOR EACH ROW
    DECLARE
        sal_diff       NUMBER;
    BEGIN
        IF INSERTING THEN
            DBMS_OUTPUT.PUT_LINE('Inserting employee ' || :NEW.empno);
            DBMS_OUTPUT.PUT_LINE('..New salary: ' || :NEW.sal);
        END IF;
        IF UPDATING THEN
            sal_diff := :NEW.sal - :OLD.sal;
            DBMS_OUTPUT.PUT_LINE('Updating employee ' || :OLD.empno);
            DBMS_OUTPUT.PUT_LINE('..Old salary: ' || :OLD.sal);
            DBMS_OUTPUT.PUT_LINE('..New salary: ' || :NEW.sal);
            DBMS_OUTPUT.PUT_LINE('..Raise     : ' || sal_diff);
        END IF;
        IF DELETING THEN
            DBMS_OUTPUT.PUT_LINE('Deleting employee ' || :OLD.empno);
            DBMS_OUTPUT.PUT_LINE('..Old salary: ' || :OLD.sal);
        END IF;
    END;

The following is an example of a compound trigger that records a change
to the employee salary by defining a compound trigger ``HR_TRIGGER`` on
table ``EMP``.

First, create a table named ``EMP``:

.. code-block:: text

    CREATE TABLE EMP(EMPNO INT, ENAME TEXT, SAL INT, DEPTNO INT);
    CREATE TABLE

Then, create a compound trigger named ``HR_TRIGGER``. The trigger utilizes
each of the four timing-points to modify the salary with an ``INSERT``,
``UPDATE``, or ``DELETE`` statement. In the global declaration section, the
initial salary is declared as ``10,000``:

.. code-block:: text

    CREATE OR REPLACE TRIGGER HR_TRIGGER
      FOR INSERT OR UPDATE OR DELETE ON EMP
        COMPOUND TRIGGER
      -- Global declaration.
      var_sal NUMBER := 10000;

      BEFORE STATEMENT IS
      BEGIN
        var_sal := var_sal + 1000;
        DBMS_OUTPUT.PUT_LINE('Before Statement: ' || var_sal);
      END BEFORE STATEMENT;

      BEFORE EACH ROW IS
      BEGIN
        var_sal := var_sal + 1000;
        DBMS_OUTPUT.PUT_LINE('Before Each Row: ' || var_sal);
      END BEFORE EACH ROW;

      AFTER EACH ROW IS
      BEGIN
        var_sal := var_sal + 1000;
        DBMS_OUTPUT.PUT_LINE('After Each Row: ' || var_sal);
      END AFTER EACH ROW;

      AFTER STATEMENT IS
      BEGIN
        var_sal := var_sal + 1000;
        DBMS_OUTPUT.PUT_LINE('After Statement: ' || var_sal);
      END AFTER STATEMENT;

    END HR_TRIGGER;

    Output: Trigger created.

``INSERT`` the record into table ``EMP``.

.. code-block:: text

    INSERT INTO EMP(EMPNO, ENAME, SAL, DEPTNO) VALUES(1111,'SMITH', 10000,
    20);

The ``INSERT`` statement produces the following output:

.. code-block:: text

    Before Statement: 11000
    Before each row: 12000
    After each row: 13000
    After statement: 14000
    INSERT 0 1

The ``UPDATE`` statement will update the employee salary record, setting the
salary to ``15000`` for a specific employee number.

.. code-block:: text

    UPDATE EMP SET SAL = 15000 where EMPNO = 1111;

The ``UPDATE`` statement produces the following output:

.. code-block:: text

    Before Statement: 11000
    Before each row: 12000
    After each row: 13000
    After statement: 14000
    UPDATE 1

    SELECT * from EMP;
     EMPNO | ENAME |  SAL  | DEPTNO
    -------+-------+-------+--------
      1111 | SMITH | 15000 |     20
    (1 row)

The ``DELETE`` statement deletes the employee salary record.

.. code-block:: text

    DELETE from EMP where EMPNO = 1111;

The ``DELETE`` statement produces the following output:

.. code-block:: text

    Before Statement: 11000
    Before each row: 12000
    After each row: 13000
    After statement: 14000
    DELETE 1

    SELECT * from EMP;
     EMPNO | ENAME | SAL | DEPTNO
    -------+-------+-----+--------
    (0 rows)

The ``TRUNCATE`` statement removes all the records from the ``EMP`` table.

.. code-block:: text

    CREATE OR REPLACE TRIGGER HR_TRIGGER
      FOR TRUNCATE ON EMP
        COMPOUND TRIGGER
      -- Global declaration.
      var_sal NUMBER := 10000;
      BEFORE STATEMENT IS
      BEGIN
        var_sal := var_sal + 1000;
        DBMS_OUTPUT.PUT_LINE('Before Statement: ' || var_sal);
      END BEFORE STATEMENT;

      AFTER STATEMENT IS
      BEGIN
        var_sal := var_sal + 1000;
        DBMS_OUTPUT.PUT_LINE('After Statement: ' || var_sal);
      END AFTER STATEMENT;

    END HR_TRIGGER;

    Output: Trigger created.

The ``TRUNCATE`` statement produces the following output:

.. code-block:: text

    TRUNCATE EMP;
    Before Statement: 11000
    After statement: 12000
    TRUNCATE TABLE

**Note:** The ``TRUNCATE`` statement may be used only at a ``BEFORE STATEMENT``
or ``AFTER STATEMENT`` timing-point.

**See Also**

:ref:`DROP TRIGGER <drop_trigger>`
