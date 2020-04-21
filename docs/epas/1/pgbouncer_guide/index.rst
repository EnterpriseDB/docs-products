
*****************************
EDB Postgres™ PgBouncer Guide
*****************************

When a client application connects to a Postgres server, it negotiates a
connection; that negotiation takes time. PgBouncer saves time by
maintaining a pool of pre-established connections to the server. Instead
of connecting directly to the server, the client connects to PgBouncer,
minimizing the connection negotiation time by using a previously
established connection made available to the client in the PgBouncer
pool.

PgBouncer is a lightweight connection pooling utility for Postgres and
Advanced Server installations that is based on the OpenSource PgBouncer
project.

EnterpriseDB enhancements for the PgBouncer project are available via
RPM Packages or a graphical PgBouncer installer that you can download
with StackBuilder Plus. The enhancements allow pgBouncer to service
clients that are using EDB Connectors that require compatible out
parameter handling.

For more information about PgBouncer, including reference and usage
information, please visit the `project site <https://pgbouncer.github.io/>`_.


.. toctree::
   :maxdepth: 3

   installing_and_configuring_pgbouncer
