// import { useState } from 'react';
// import { Bell, Check, ChevronLeft, ThumbsUp, MessageSquare } from 'lucide-react';

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState([
//     {
//       id: 1,
//       type: 'LIKE',
//       content: 'liked your article "Getting Started with React"',
//       actor: 'John Doe',
//       date: '2024-12-20T10:30:00',
//       isRead: false,
//       articleId: 1
//     },
//     {
//       id: 2,
//       type: 'COMMENT',
//       content: 'commented on your article "Mastering Tailwind CSS"',
//       actor: 'Alice Johnson',
//       date: '2024-12-19T15:45:00',
//       isRead: true,
//       articleId: 2
//     },
//     {
//       id: 3,
//       type: 'COMMENT',
//       content: 'commented on your article "Vue.js Best Practices"',
//       actor: 'Bob Wilson',
//       date: '2024-12-19T09:15:00',
//       isRead: false,
//       articleId: 3
//     }
//   ]);

//   const getNotificationIcon = (type: string) => {
//     switch (type) {
//       case 'LIKE':
//         return <ThumbsUp className="h-5 w-5 text-blue-500" />;
//       case 'COMMENT':
//         return <MessageSquare className="h-5 w-5 text-green-500" />;
//       default:
//         return <Bell className="h-5 w-5 text-gray-500" />;
//     }
//   };

//   const formatDate = (dateString: string | number | Date) => {
//     const date = new Date(dateString);
//     const now = new Date();
//     const diff = now - date;
//     const days = Math.floor(diff / (1000 * 60 * 60 * 24));
//     const hours = Math.floor(diff / (1000 * 60 * 60));
//     const minutes = Math.floor(diff / (1000 * 60));

//     if (days > 0) return `${days}d ago`;
//     if (hours > 0) return `${hours}h ago`;
//     return `${minutes}m ago`;
//   };

//   const markAsRead = (notificationId: number) => {
//     setNotifications(notifications.map(notification =>
//       notification.id === notificationId
//         ? { ...notification, isRead: true }
//         : notification
//     ));
//   };

//   const markAllAsRead = () => {
//     setNotifications(notifications.map(notification => ({
//       ...notification,
//       isRead: true
//     })));
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="max-w-3xl mx-auto px-4 py-8">
//         <div className="mb-6 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <a href="/home" className="text-gray-600 hover:text-gray-900">
//               <ChevronLeft className="h-6 w-6" />
//             </a>
//             <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//               <Bell className="h-6 w-6" />
//               Notifications
//             </h1>
//           </div>
//           <button
//             onClick={markAllAsRead}
//             className="text-sm text-blue-600 hover:text-blue-700"
//           >
//             Mark all as read
//           </button>
//         </div>

//         <div className="space-y-4">
//           {notifications.map(notification => (
//             <div
//               key={notification.id}
//               className={`bg-white rounded-lg shadow p-4 transition-all ${
//                 notification.isRead ? 'opacity-75' : 'border-l-4 border-blue-500'
//               }`}
//             >
//               <div className="flex items-start justify-between gap-4">
//                 <div className="flex items-start gap-3">
//                   <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
//                     {getNotificationIcon(notification.type)}
//                   </div>
//                   <div>
//                     <div className="flex items-center gap-2">
//                       <span className="font-medium text-gray-900">{notification.actor}</span>
//                       <span className="text-gray-600">{notification.content}</span>
//                     </div>
//                     <div className="mt-1 text-sm text-gray-500">
//                       {formatDate(notification.date)}
//                     </div>
//                   </div>
//                 </div>
//                 {!notification.isRead && (
//                   <button
//                     onClick={() => markAsRead(notification.id)}
//                     className="flex-shrink-0 text-blue-600 hover:text-blue-700"
//                     title="Mark as read"
//                   >
//                     <Check className="h-5 w-5" />
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>

//         {notifications.length === 0 && (
//           <div className="text-center py-12">
//             <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
//             <h3 className="text-lg font-medium text-gray-900">No notifications yet</h3>
//             <p className="text-gray-600">We'll notify you when something interesting happens!</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }