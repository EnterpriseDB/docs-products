.. _upgrading_pem_installation_linux_rpm:


*****************************************************************************
`Upgrading PEM that was installed with an RPM Package on a Linux Host`:index:
*****************************************************************************

The following sections will walk you through the upgrade process on a Linux host, step-by-step.

Prerequisites:

If you are using a version of Postgres or Advanced Server that is lower than version 10, then before the upgrade you need to install the libs package of version 10 or above on the system where PEM server is Installed. Use the following commands to install the libs version 10 or above:

- For Advanced Server:
   ``yum install edb-as<version>-server-libs``

- For Postgres:
   ``yum install postgresql<version>-libs``

Where, *version* is the Postgres or Advanced Server version whose libs package you want to install.


Upgrading a PEM Agent that was installed using RPMs
===================================================

You can use an RPM package to upgrade existing agents that were
initially installed by a package. The upgrade process does not update the PEM agent configuration file. After installing the new agent, you must manually copy the configuration file of the existing agent to the new installation location.

To use RPM packages to upgrade a PEM agent, you must use the following command:

   ``yum upgrade edb-pem-agent``

If any lower version PEM Agent on CentOS 6.x that is registered with a PEM server is upgraded to 7.10, you may see the following warning:

``warning: %postun(edb-pem-agent-7.9.0-3.rhel6.x86_64) scriptlet failed, exit status 1``

``Non-fatal POSTUN scriptlet failure in rpm package edb-pem-agent``

In spite of the above warning, the upgrade gets successfully completed and the agent is automatically restarted after upgrade.

.. note:: If you have already configured or planning to configure any shell/batch script run by a Linux agent that is upgraded from any lower version to 7.11 or later version, the user for the ``batch_script_user`` parameter must be specified in the ``agent.cfg`` file.  It is strongly recommended that a non-root user is used to run the scripts.  Using the root user may result in compromising the data security and operating system security.  However, if you want to restore the pemagent to its original settings using root user to run the scripts, then the ``batch_script_user`` parameter value must be set to ``root``.

.. raw:: latex

  \newpage

Upgrading the PEM Server that was installed using RPMs
=======================================================

If you have installed your PEM server with an RPM package, you can use an RPM
to upgrade your PEM server.

If you want to upgrade PEM server that is installed on a machine in isolated network, you need to create PEM repository on that machine before you upgrade the PEM server. For more information on creating PEM repository in isolated network, see 
`Creating PEM repository in isolated network <creating_pem_repository_in_isolated_network>`_.


To use an RPM package to upgrade an existing RPM installation, you must:

1. Use your package manager to upgrade the installed version of the PEM server:

   ``yum upgrade edb-pem``

2. Configure the upgraded server:

   ``/usr/edb/pem/bin/configure-pem-server.sh``

When invoking the configuration script, you can include command line options to specify configuration properties; the script will prompt you for values that you omit on the command line. The accepted options are:

.. tabularcolumns:: |\Y{0.1}|\Y{0.9}|

+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|  Option        | Description                                                                                                                                                                                                                                                                  |
+================+==============================================================================================================================================================================================================================================================================+
|    ``-acp``    | Defines PEM Agent certificate path. The default is /root/.pem.                                                                                                                                                                                                               |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|    ``-ci``     | CIDR formatted network address range that agents will connect to the server from, to be added to the server's pg_hba.conf file. For example, 192.168.1.0/24. The default is 0.0.0.0/0.                                                                                       |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|    ``-dbi``    | The directory for the database server installation. For example, /usr/edb/as10 for Advanced Server or /usr/pgsql-10 for PostgreSQL.                                                                                                                                          |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     ``-ds``    | The unit file name of the PEM database server. For Advanced Server, the default file name is edb-as-10; for PostgreSQL, it is postgresql-10.                                                                                                                                 |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     ``-ho``    | The host address of the PEM database server.                                                                                                                                                                                                                                 |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     ``-p``     | The port number of the PEM database server.                                                                                                                                                                                                                                  |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     ``-ps``    | The service name of the pemagent; the default value is pemagent.                                                                                                                                                                                                             |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     ``-sp``    | The superuser password of the PEM database server. This value is required.                                                                                                                                                                                                   |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     ``-su``    | The superuser name of the PEM database server.                                                                                                                                                                                                                               |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|     ``-t``     | The installation type: Specify 1 if the configuration is for web services and backing database, 2 if you are configuring web services, or 3 if you are configuring the backing database. If you specify 3, please note that the database must reside on the local host.      |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|    ``-un``     | Uninstalls PEM server.                                                                                                                                                                                                                                                       |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+
|    ``-h``      | Displays help.                                                                                                                                                                                                                                                               |
+----------------+------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------+


If you do not provide configuration properties on the command line, you
will be prompted for values by the script. To view script-related help,
use the command:

   ``/usr/edb/pem/bin/configure-pem-server.sh --help``

If you are upgrading a 7.10 PEM Server on RHEL 6.x to PEM version 7.11, you may see the following error text during the upgrade:

  ``/var/tmp/rpm-tmp.<xxxxxx>: line 9: Requires:: command not found``

In spite of the above error, the upgrade gets completed successfully.

After executing the PEM server configuration file, use your version-specific service control command to restart the ``httpd`` service.

For detailed information about using an RPM package to install or
configure the PEM server or PEM agent, please see the *PEM Installation Guide*, available at:

  http://www.enterprisedb.com/products-services-training/products/documentation/enterpriseedition

.. raw:: latex

   \newpage

Upgrading SQL Profiler on a Linux host
======================================

To upgrade a SQL Profiler installation that resides on a Linux host:

1. Delete the existing SQL Profiler query set on each node by invoking
   the ``uninstall-sql-profiler.sql`` script.

   By default, if you are using Advanced Server on a Linux host that was
   installed with a graphical installer, the script resides in the
   ``share/contrib`` directory under the Advanced Server installation.

   If you are using a PostgreSQL installation on a Linux host, the
   script resides in the ``share/postgresql/contrib`` directory under the
   PostgreSQL installation.

2. Use the following command on the node you wish to profile:

    ``yum install postgresql<pg_version>-sqlprofiler-<sql_profiler_version>``

Where, *pg_version* is the version of the postgres and *sqlprofiler_version* is the SQL Profiler version.

  After updating the PEM components, you are ready to update the backing database.

 .. raw:: latex

    \newpage
