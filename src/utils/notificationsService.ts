import Swal from 'sweetalert2';

// Configuración global por defecto para notificaciones toast
Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast: any) => {
    toast.addEventListener('mouseenter', Swal.stopTimer);
    toast.addEventListener('mouseleave', Swal.resumeTimer);
  }
});

export interface NotificationOptions {
  title?: string;
  text?: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  confirmButtonText?: string;
  cancelButtonText?: string;
  showCancelButton?: boolean;
  timer?: number;
}

export class NotificationService {
  // Notificaciones toast (pequeñas, automáticas)
  static success(title: string, timer: number = 1000) {
    return Swal.fire({
      icon: 'success',
      title,
      timer,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true
    });
  }

  static error(title: string, timer: number = 3000) {
    return Swal.fire({
      icon: 'error',
      title,
      timer,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true
    });
  }

  static warning(title: string, timer: number = 2000) {
    return Swal.fire({
      icon: 'warning',
      title,
      timer,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true
    });
  }

  static info(title: string, timer: number = 2000) {
    return Swal.fire({
      icon: 'info',
      title,
      timer,
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timerProgressBar: true
    });
  }

  // Diálogos modales (requieren confirmación)
  static confirm(options: NotificationOptions): Promise<any> {
    return Swal.fire({
      icon: 'question',
      title: options.title || 'Are you sure?',
      text: options.text,
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#64748b',
      confirmButtonText: options.confirmButtonText || 'Yes',
      cancelButtonText: options.cancelButtonText || 'Cancel',
      reverseButtons: true
    });
  }

  static confirmDelete(itemName: string = 'this item'): Promise<boolean> {
    return Swal.fire({
      title: `Delete ${itemName}?`,
      text: `Are you sure you want to delete ${itemName}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result: any) => result.isConfirmed);
  }

  static confirmArchive(itemName: string = 'this item', isArchived: boolean = false): Promise<boolean> {
    const action = isArchived ? 'unarchive' : 'archive';
    return Swal.fire({
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} ${itemName}?`,
      text: `Are you sure you want to ${action} ${itemName}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#6366f1',
      cancelButtonColor: '#64748b',
      confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelButtonText: 'Cancel',
      reverseButtons: true
    }).then((result: any) => result.isConfirmed);
  }

  // Diálogos de información
  static showModal(options: NotificationOptions): Promise<any> {
    return Swal.fire({
      icon: options.icon || 'info',
      title: options.title,
      text: options.text,
      confirmButtonColor: '#6366f1',
      confirmButtonText: options.confirmButtonText || 'OK'
    });
  }

  static showError(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      confirmButtonColor: '#6366f1',
      confirmButtonText: 'OK'
    });
  }

  static showSuccess(title: string, text?: string): Promise<any> {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      confirmButtonColor: '#6366f1',
      confirmButtonText: 'OK'
    });
  }

  // Loading
  static showLoading(title: string = 'Loading...'): Promise<any> {
    return Swal.fire({
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  }

  static close(): void {
    Swal.close();
  }
}

export default NotificationService;
