package com.gateguard;

import androidx.annotation.NonNull;
import androidx.room.InvalidationTracker;
import androidx.room.RoomOpenDelegate;
import androidx.room.migration.AutoMigrationSpec;
import androidx.room.migration.Migration;
import androidx.room.util.DBUtil;
import androidx.room.util.TableInfo;
import androidx.sqlite.SQLite;
import androidx.sqlite.SQLiteConnection;
import java.lang.Class;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import javax.annotation.processing.Generated;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation", "removal"})
public final class AppDatabase_Impl extends AppDatabase {
  private volatile VisitorLogDao _visitorLogDao;

  private volatile UserDao _userDao;

  @Override
  @NonNull
  protected RoomOpenDelegate createOpenDelegate() {
    final RoomOpenDelegate _openDelegate = new RoomOpenDelegate(5, "e80a29ae8b889838807e75a890d6f90e", "5fb74d071f62bc07406543056c43e1cf") {
      @Override
      public void createAllTables(@NonNull final SQLiteConnection connection) {
        SQLite.execSQL(connection, "CREATE TABLE IF NOT EXISTS `visitor_logs` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `remoteId` TEXT NOT NULL, `passId` TEXT NOT NULL, `hostUid` TEXT NOT NULL, `scannedByUid` TEXT NOT NULL, `visitorName` TEXT NOT NULL, `phoneNumber` TEXT NOT NULL, `visitorType` TEXT NOT NULL, `towerBlock` TEXT NOT NULL, `flatNumber` TEXT NOT NULL, `vehicleNumber` TEXT NOT NULL, `noOfVisitors` TEXT NOT NULL, `visitDate` TEXT NOT NULL, `fromTime` TEXT NOT NULL, `toTime` TEXT NOT NULL, `purpose` TEXT NOT NULL, `status` TEXT NOT NULL, `reason` TEXT NOT NULL, `scannedAt` TEXT NOT NULL, `scannedAtMillis` INTEGER NOT NULL, `type` TEXT NOT NULL, `synced` INTEGER NOT NULL)");
        SQLite.execSQL(connection, "CREATE TABLE IF NOT EXISTS `users` (`id` INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, `name` TEXT NOT NULL, `email` TEXT NOT NULL, `password` TEXT NOT NULL, `role` TEXT NOT NULL)");
        SQLite.execSQL(connection, "CREATE TABLE IF NOT EXISTS room_master_table (id INTEGER PRIMARY KEY,identity_hash TEXT)");
        SQLite.execSQL(connection, "INSERT OR REPLACE INTO room_master_table (id,identity_hash) VALUES(42, 'e80a29ae8b889838807e75a890d6f90e')");
      }

      @Override
      public void dropAllTables(@NonNull final SQLiteConnection connection) {
        SQLite.execSQL(connection, "DROP TABLE IF EXISTS `visitor_logs`");
        SQLite.execSQL(connection, "DROP TABLE IF EXISTS `users`");
      }

      @Override
      public void onCreate(@NonNull final SQLiteConnection connection) {
      }

      @Override
      public void onOpen(@NonNull final SQLiteConnection connection) {
        internalInitInvalidationTracker(connection);
      }

      @Override
      public void onPreMigrate(@NonNull final SQLiteConnection connection) {
        DBUtil.dropFtsSyncTriggers(connection);
      }

      @Override
      public void onPostMigrate(@NonNull final SQLiteConnection connection) {
      }

      @Override
      @NonNull
      public RoomOpenDelegate.ValidationResult onValidateSchema(
          @NonNull final SQLiteConnection connection) {
        final Map<String, TableInfo.Column> _columnsVisitorLogs = new HashMap<String, TableInfo.Column>(22);
        _columnsVisitorLogs.put("id", new TableInfo.Column("id", "INTEGER", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("remoteId", new TableInfo.Column("remoteId", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("passId", new TableInfo.Column("passId", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("hostUid", new TableInfo.Column("hostUid", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("scannedByUid", new TableInfo.Column("scannedByUid", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("visitorName", new TableInfo.Column("visitorName", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("phoneNumber", new TableInfo.Column("phoneNumber", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("visitorType", new TableInfo.Column("visitorType", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("towerBlock", new TableInfo.Column("towerBlock", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("flatNumber", new TableInfo.Column("flatNumber", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("vehicleNumber", new TableInfo.Column("vehicleNumber", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("noOfVisitors", new TableInfo.Column("noOfVisitors", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("visitDate", new TableInfo.Column("visitDate", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("fromTime", new TableInfo.Column("fromTime", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("toTime", new TableInfo.Column("toTime", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("purpose", new TableInfo.Column("purpose", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("status", new TableInfo.Column("status", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("reason", new TableInfo.Column("reason", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("scannedAt", new TableInfo.Column("scannedAt", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("scannedAtMillis", new TableInfo.Column("scannedAtMillis", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("type", new TableInfo.Column("type", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsVisitorLogs.put("synced", new TableInfo.Column("synced", "INTEGER", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final Set<TableInfo.ForeignKey> _foreignKeysVisitorLogs = new HashSet<TableInfo.ForeignKey>(0);
        final Set<TableInfo.Index> _indicesVisitorLogs = new HashSet<TableInfo.Index>(0);
        final TableInfo _infoVisitorLogs = new TableInfo("visitor_logs", _columnsVisitorLogs, _foreignKeysVisitorLogs, _indicesVisitorLogs);
        final TableInfo _existingVisitorLogs = TableInfo.read(connection, "visitor_logs");
        if (!_infoVisitorLogs.equals(_existingVisitorLogs)) {
          return new RoomOpenDelegate.ValidationResult(false, "visitor_logs(com.gateguard.VisitorLogEntity).\n"
                  + " Expected:\n" + _infoVisitorLogs + "\n"
                  + " Found:\n" + _existingVisitorLogs);
        }
        final Map<String, TableInfo.Column> _columnsUsers = new HashMap<String, TableInfo.Column>(5);
        _columnsUsers.put("id", new TableInfo.Column("id", "INTEGER", true, 1, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsUsers.put("name", new TableInfo.Column("name", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsUsers.put("email", new TableInfo.Column("email", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsUsers.put("password", new TableInfo.Column("password", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        _columnsUsers.put("role", new TableInfo.Column("role", "TEXT", true, 0, null, TableInfo.CREATED_FROM_ENTITY));
        final Set<TableInfo.ForeignKey> _foreignKeysUsers = new HashSet<TableInfo.ForeignKey>(0);
        final Set<TableInfo.Index> _indicesUsers = new HashSet<TableInfo.Index>(0);
        final TableInfo _infoUsers = new TableInfo("users", _columnsUsers, _foreignKeysUsers, _indicesUsers);
        final TableInfo _existingUsers = TableInfo.read(connection, "users");
        if (!_infoUsers.equals(_existingUsers)) {
          return new RoomOpenDelegate.ValidationResult(false, "users(com.gateguard.UserEntity).\n"
                  + " Expected:\n" + _infoUsers + "\n"
                  + " Found:\n" + _existingUsers);
        }
        return new RoomOpenDelegate.ValidationResult(true, null);
      }
    };
    return _openDelegate;
  }

  @Override
  @NonNull
  protected InvalidationTracker createInvalidationTracker() {
    final Map<String, String> _shadowTablesMap = new HashMap<String, String>(0);
    final Map<String, Set<String>> _viewTables = new HashMap<String, Set<String>>(0);
    return new InvalidationTracker(this, _shadowTablesMap, _viewTables, "visitor_logs", "users");
  }

  @Override
  public void clearAllTables() {
    super.performClear(false, "visitor_logs", "users");
  }

  @Override
  @NonNull
  protected Map<Class<?>, List<Class<?>>> getRequiredTypeConverters() {
    final Map<Class<?>, List<Class<?>>> _typeConvertersMap = new HashMap<Class<?>, List<Class<?>>>();
    _typeConvertersMap.put(VisitorLogDao.class, VisitorLogDao_Impl.getRequiredConverters());
    _typeConvertersMap.put(UserDao.class, UserDao_Impl.getRequiredConverters());
    return _typeConvertersMap;
  }

  @Override
  @NonNull
  public Set<Class<? extends AutoMigrationSpec>> getRequiredAutoMigrationSpecs() {
    final Set<Class<? extends AutoMigrationSpec>> _autoMigrationSpecsSet = new HashSet<Class<? extends AutoMigrationSpec>>();
    return _autoMigrationSpecsSet;
  }

  @Override
  @NonNull
  public List<Migration> getAutoMigrations(
      @NonNull final Map<Class<? extends AutoMigrationSpec>, AutoMigrationSpec> autoMigrationSpecs) {
    final List<Migration> _autoMigrations = new ArrayList<Migration>();
    return _autoMigrations;
  }

  @Override
  public VisitorLogDao visitorLogDao() {
    if (_visitorLogDao != null) {
      return _visitorLogDao;
    } else {
      synchronized(this) {
        if(_visitorLogDao == null) {
          _visitorLogDao = new VisitorLogDao_Impl(this);
        }
        return _visitorLogDao;
      }
    }
  }

  @Override
  public UserDao userDao() {
    if (_userDao != null) {
      return _userDao;
    } else {
      synchronized(this) {
        if(_userDao == null) {
          _userDao = new UserDao_Impl(this);
        }
        return _userDao;
      }
    }
  }
}
