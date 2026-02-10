import {
  type LucideIcon,
  UserCheck,
  Package,
  AlertTriangle,
  FileX,
  UserPlus,
  Pencil,
  Trash2,
  LogIn,
  LogOut,
  UserX,
} from "lucide-react";

const fireArmStatusIcons: Record<FireArmStatus, LucideIcon> = {
  issued: UserCheck,
  stocked: Package,
  loss: AlertTriangle,
  disposition: FileX,
};

const auditStatusIcons: Record<AuditStatus, LucideIcon> = {
  register: UserPlus,
  update: Pencil,
  delete: Trash2,
  login: LogIn,
  logout: LogOut,
};

const adminAccStatusIcons: Record<AdminAccStatus, LucideIcon> = {
  active: UserCheck,
  deactivated: UserX,
};

const accessIcon = {
  firearmRecord: fireArmStatusIcons,
  auditLog: auditStatusIcons,
  adminAcc: adminAccStatusIcons,
};

type AccessIconKeys = keyof typeof accessIcon;

function StatusIcons<
  T extends AccessIconKeys
>(
  recordType: T,
  iconKey: keyof typeof accessIcon[T]
): LucideIcon {
  return accessIcon[recordType][iconKey] as LucideIcon;
}


export { StatusIcons as default };
