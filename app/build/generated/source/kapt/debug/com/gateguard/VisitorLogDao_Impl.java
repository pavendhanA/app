package com.gateguard;

import androidx.annotation.NonNull;
import androidx.room.EntityInsertAdapter;
import androidx.room.RoomDatabase;
import androidx.room.util.DBUtil;
import androidx.room.util.SQLiteStatementUtil;
import androidx.sqlite.SQLiteStatement;
import java.lang.Class;
import java.lang.NullPointerException;
import java.lang.Object;
import java.lang.Override;
import java.lang.String;
import java.lang.SuppressWarnings;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import javax.annotation.processing.Generated;
import kotlin.Unit;
import kotlin.coroutines.Continuation;

@Generated("androidx.room.RoomProcessor")
@SuppressWarnings({"unchecked", "deprecation", "removal"})
public final class VisitorLogDao_Impl implements VisitorLogDao {
  private final RoomDatabase __db;

  private final EntityInsertAdapter<VisitorLogEntity> __insertAdapterOfVisitorLogEntity;

  public VisitorLogDao_Impl(@NonNull final RoomDatabase __db) {
    this.__db = __db;
    this.__insertAdapterOfVisitorLogEntity = new EntityInsertAdapter<VisitorLogEntity>() {
      @Override
      @NonNull
      protected String createQuery() {
        return "INSERT OR REPLACE INTO `visitor_logs` (`id`,`remoteId`,`passId`,`hostUid`,`scannedByUid`,`visitorName`,`phoneNumber`,`visitorType`,`towerBlock`,`flatNumber`,`vehicleNumber`,`noOfVisitors`,`visitDate`,`fromTime`,`toTime`,`purpose`,`status`,`reason`,`scannedAt`,`scannedAtMillis`,`type`,`synced`) VALUES (nullif(?, 0),?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      }

      @Override
      protected void bind(@NonNull final SQLiteStatement statement,
          @NonNull final VisitorLogEntity entity) {
        statement.bindLong(1, entity.getId());
        if (entity.getRemoteId() == null) {
          statement.bindNull(2);
        } else {
          statement.bindText(2, entity.getRemoteId());
        }
        if (entity.getPassId() == null) {
          statement.bindNull(3);
        } else {
          statement.bindText(3, entity.getPassId());
        }
        if (entity.getHostUid() == null) {
          statement.bindNull(4);
        } else {
          statement.bindText(4, entity.getHostUid());
        }
        if (entity.getScannedByUid() == null) {
          statement.bindNull(5);
        } else {
          statement.bindText(5, entity.getScannedByUid());
        }
        if (entity.getVisitorName() == null) {
          statement.bindNull(6);
        } else {
          statement.bindText(6, entity.getVisitorName());
        }
        if (entity.getPhoneNumber() == null) {
          statement.bindNull(7);
        } else {
          statement.bindText(7, entity.getPhoneNumber());
        }
        if (entity.getVisitorType() == null) {
          statement.bindNull(8);
        } else {
          statement.bindText(8, entity.getVisitorType());
        }
        if (entity.getTowerBlock() == null) {
          statement.bindNull(9);
        } else {
          statement.bindText(9, entity.getTowerBlock());
        }
        if (entity.getFlatNumber() == null) {
          statement.bindNull(10);
        } else {
          statement.bindText(10, entity.getFlatNumber());
        }
        if (entity.getVehicleNumber() == null) {
          statement.bindNull(11);
        } else {
          statement.bindText(11, entity.getVehicleNumber());
        }
        if (entity.getNoOfVisitors() == null) {
          statement.bindNull(12);
        } else {
          statement.bindText(12, entity.getNoOfVisitors());
        }
        if (entity.getVisitDate() == null) {
          statement.bindNull(13);
        } else {
          statement.bindText(13, entity.getVisitDate());
        }
        if (entity.getFromTime() == null) {
          statement.bindNull(14);
        } else {
          statement.bindText(14, entity.getFromTime());
        }
        if (entity.getToTime() == null) {
          statement.bindNull(15);
        } else {
          statement.bindText(15, entity.getToTime());
        }
        if (entity.getPurpose() == null) {
          statement.bindNull(16);
        } else {
          statement.bindText(16, entity.getPurpose());
        }
        if (entity.getStatus() == null) {
          statement.bindNull(17);
        } else {
          statement.bindText(17, entity.getStatus());
        }
        if (entity.getReason() == null) {
          statement.bindNull(18);
        } else {
          statement.bindText(18, entity.getReason());
        }
        if (entity.getScannedAt() == null) {
          statement.bindNull(19);
        } else {
          statement.bindText(19, entity.getScannedAt());
        }
        statement.bindLong(20, entity.getScannedAtMillis());
        if (entity.getType() == null) {
          statement.bindNull(21);
        } else {
          statement.bindText(21, entity.getType());
        }
        final int _tmp = entity.getSynced() ? 1 : 0;
        statement.bindLong(22, _tmp);
      }
    };
  }

  @Override
  public Object insertLog(final VisitorLogEntity log,
      final Continuation<? super Unit> $completion) {
    if (log == null) throw new NullPointerException();
    return DBUtil.performSuspending(__db, false, true, (_connection) -> {
      __insertAdapterOfVisitorLogEntity.insert(_connection, log);
      return Unit.INSTANCE;
    }, $completion);
  }

  @Override
  public Object getAllLogs(final Continuation<? super List<VisitorLogEntity>> $completion) {
    final String _sql = "SELECT * FROM visitor_logs ORDER BY id DESC";
    return DBUtil.performSuspending(__db, true, false, (_connection) -> {
      final SQLiteStatement _stmt = _connection.prepare(_sql);
      try {
        final int _columnIndexOfId = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "id");
        final int _columnIndexOfRemoteId = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "remoteId");
        final int _columnIndexOfPassId = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "passId");
        final int _columnIndexOfHostUid = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "hostUid");
        final int _columnIndexOfScannedByUid = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "scannedByUid");
        final int _columnIndexOfVisitorName = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "visitorName");
        final int _columnIndexOfPhoneNumber = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "phoneNumber");
        final int _columnIndexOfVisitorType = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "visitorType");
        final int _columnIndexOfTowerBlock = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "towerBlock");
        final int _columnIndexOfFlatNumber = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "flatNumber");
        final int _columnIndexOfVehicleNumber = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "vehicleNumber");
        final int _columnIndexOfNoOfVisitors = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "noOfVisitors");
        final int _columnIndexOfVisitDate = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "visitDate");
        final int _columnIndexOfFromTime = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "fromTime");
        final int _columnIndexOfToTime = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "toTime");
        final int _columnIndexOfPurpose = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "purpose");
        final int _columnIndexOfStatus = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "status");
        final int _columnIndexOfReason = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "reason");
        final int _columnIndexOfScannedAt = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "scannedAt");
        final int _columnIndexOfScannedAtMillis = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "scannedAtMillis");
        final int _columnIndexOfType = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "type");
        final int _columnIndexOfSynced = SQLiteStatementUtil.getColumnIndexOrThrow(_stmt, "synced");
        final List<VisitorLogEntity> _result = new ArrayList<VisitorLogEntity>();
        while (_stmt.step()) {
          final VisitorLogEntity _item;
          final int _tmpId;
          _tmpId = (int) (_stmt.getLong(_columnIndexOfId));
          final String _tmpRemoteId;
          if (_stmt.isNull(_columnIndexOfRemoteId)) {
            _tmpRemoteId = null;
          } else {
            _tmpRemoteId = _stmt.getText(_columnIndexOfRemoteId);
          }
          final String _tmpPassId;
          if (_stmt.isNull(_columnIndexOfPassId)) {
            _tmpPassId = null;
          } else {
            _tmpPassId = _stmt.getText(_columnIndexOfPassId);
          }
          final String _tmpHostUid;
          if (_stmt.isNull(_columnIndexOfHostUid)) {
            _tmpHostUid = null;
          } else {
            _tmpHostUid = _stmt.getText(_columnIndexOfHostUid);
          }
          final String _tmpScannedByUid;
          if (_stmt.isNull(_columnIndexOfScannedByUid)) {
            _tmpScannedByUid = null;
          } else {
            _tmpScannedByUid = _stmt.getText(_columnIndexOfScannedByUid);
          }
          final String _tmpVisitorName;
          if (_stmt.isNull(_columnIndexOfVisitorName)) {
            _tmpVisitorName = null;
          } else {
            _tmpVisitorName = _stmt.getText(_columnIndexOfVisitorName);
          }
          final String _tmpPhoneNumber;
          if (_stmt.isNull(_columnIndexOfPhoneNumber)) {
            _tmpPhoneNumber = null;
          } else {
            _tmpPhoneNumber = _stmt.getText(_columnIndexOfPhoneNumber);
          }
          final String _tmpVisitorType;
          if (_stmt.isNull(_columnIndexOfVisitorType)) {
            _tmpVisitorType = null;
          } else {
            _tmpVisitorType = _stmt.getText(_columnIndexOfVisitorType);
          }
          final String _tmpTowerBlock;
          if (_stmt.isNull(_columnIndexOfTowerBlock)) {
            _tmpTowerBlock = null;
          } else {
            _tmpTowerBlock = _stmt.getText(_columnIndexOfTowerBlock);
          }
          final String _tmpFlatNumber;
          if (_stmt.isNull(_columnIndexOfFlatNumber)) {
            _tmpFlatNumber = null;
          } else {
            _tmpFlatNumber = _stmt.getText(_columnIndexOfFlatNumber);
          }
          final String _tmpVehicleNumber;
          if (_stmt.isNull(_columnIndexOfVehicleNumber)) {
            _tmpVehicleNumber = null;
          } else {
            _tmpVehicleNumber = _stmt.getText(_columnIndexOfVehicleNumber);
          }
          final String _tmpNoOfVisitors;
          if (_stmt.isNull(_columnIndexOfNoOfVisitors)) {
            _tmpNoOfVisitors = null;
          } else {
            _tmpNoOfVisitors = _stmt.getText(_columnIndexOfNoOfVisitors);
          }
          final String _tmpVisitDate;
          if (_stmt.isNull(_columnIndexOfVisitDate)) {
            _tmpVisitDate = null;
          } else {
            _tmpVisitDate = _stmt.getText(_columnIndexOfVisitDate);
          }
          final String _tmpFromTime;
          if (_stmt.isNull(_columnIndexOfFromTime)) {
            _tmpFromTime = null;
          } else {
            _tmpFromTime = _stmt.getText(_columnIndexOfFromTime);
          }
          final String _tmpToTime;
          if (_stmt.isNull(_columnIndexOfToTime)) {
            _tmpToTime = null;
          } else {
            _tmpToTime = _stmt.getText(_columnIndexOfToTime);
          }
          final String _tmpPurpose;
          if (_stmt.isNull(_columnIndexOfPurpose)) {
            _tmpPurpose = null;
          } else {
            _tmpPurpose = _stmt.getText(_columnIndexOfPurpose);
          }
          final String _tmpStatus;
          if (_stmt.isNull(_columnIndexOfStatus)) {
            _tmpStatus = null;
          } else {
            _tmpStatus = _stmt.getText(_columnIndexOfStatus);
          }
          final String _tmpReason;
          if (_stmt.isNull(_columnIndexOfReason)) {
            _tmpReason = null;
          } else {
            _tmpReason = _stmt.getText(_columnIndexOfReason);
          }
          final String _tmpScannedAt;
          if (_stmt.isNull(_columnIndexOfScannedAt)) {
            _tmpScannedAt = null;
          } else {
            _tmpScannedAt = _stmt.getText(_columnIndexOfScannedAt);
          }
          final long _tmpScannedAtMillis;
          _tmpScannedAtMillis = _stmt.getLong(_columnIndexOfScannedAtMillis);
          final String _tmpType;
          if (_stmt.isNull(_columnIndexOfType)) {
            _tmpType = null;
          } else {
            _tmpType = _stmt.getText(_columnIndexOfType);
          }
          final boolean _tmpSynced;
          final int _tmp;
          _tmp = (int) (_stmt.getLong(_columnIndexOfSynced));
          _tmpSynced = _tmp != 0;
          _item = new VisitorLogEntity(_tmpId,_tmpRemoteId,_tmpPassId,_tmpHostUid,_tmpScannedByUid,_tmpVisitorName,_tmpPhoneNumber,_tmpVisitorType,_tmpTowerBlock,_tmpFlatNumber,_tmpVehicleNumber,_tmpNoOfVisitors,_tmpVisitDate,_tmpFromTime,_tmpToTime,_tmpPurpose,_tmpStatus,_tmpReason,_tmpScannedAt,_tmpScannedAtMillis,_tmpType,_tmpSynced);
          _result.add(_item);
        }
        return _result;
      } finally {
        _stmt.close();
      }
    }, $completion);
  }

  @Override
  public Object clearAllLogs(final Continuation<? super Unit> $completion) {
    final String _sql = "DELETE FROM visitor_logs";
    return DBUtil.performSuspending(__db, false, true, (_connection) -> {
      final SQLiteStatement _stmt = _connection.prepare(_sql);
      try {
        _stmt.step();
        return Unit.INSTANCE;
      } finally {
        _stmt.close();
      }
    }, $completion);
  }

  @NonNull
  public static List<Class<?>> getRequiredConverters() {
    return Collections.emptyList();
  }
}
