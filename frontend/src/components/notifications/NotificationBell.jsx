import {useState , useRef , useEffect} from "react";
import {Bell} from "lucide-react";
import { useNotifications } from "../../context/NotificationContext";
import NotificationDropdown from "./NotificationDropdown";


const NotificationBell = () =>{
    const {unreadCount} = useNotifications();
    const [isOpen , setIsOpen] = useState(false);
    const bellRef = useRef(null);

    useEffect(() =>{
        const handleClickOutSide = (event) =>{
            if(bellRef.current && !bellRef.current.contains(event.target)){
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown" , handleClickOutSide);
        return () => document.removeEventListener("mousedown" , handleClickOutSide);
    },[]);

    return(
        <div className="relative " ref = {bellRef} >
            <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                aria-label="View notifications"
                className="relative cursor-pointer rounded-lg border border-gray-200 p-2 text-gray-600 transition-colors hover:border-violet-300 hover:bg-violet-50 hover:text-violet-600 dark:border-gray-700 dark:text-gray-300 dark:hover:border-violet-500/30 dark:hover:bg-gray-800 dark:hover:text-violet-400"
            >
                <Bell size={19} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white shadow-sm ring-2 ring-white dark:ring-gray-800">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}
            </button>
            {isOpen && <NotificationDropdown onClose={() => setIsOpen(false)} />}
        </div>
    );
};

export default NotificationBell;
