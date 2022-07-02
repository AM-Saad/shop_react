import { useContext } from 'react'
import AdminCtx from '../../../store/Admin/admin-context';
import { Link } from 'react-router-dom'
import Zone from '../../../models/Zone';

const ZoneItem: React.FC<{ zone: Zone }> = ({ zone }) => {
    const adminCtx = useContext(AdminCtx)
    return (
        <>
            <li key={zone._id}>
                <Link to={`/admin/zones/${zone._id}`} className="block hover:bg-gray-50">
                    <div className="flex items-center px-4 py-4 sm:px-6">
                        <div className="min-w-0 flex-1 flex items-center">
                            <div className="flex-shrink-0">
                            </div>
                            <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                                <div>
                                    <p className="text-sm text-left font-medium text-indigo-600 truncate">{zone.name}</p>
                                    <p className="mt-2 flex items-center text-sm text-gray-500">
                                        <span className="truncate">#{zone.zoneId}</span>
                                    </p>
                                </div>
                                <div className="hidden md:block">
                                    <div>
                                        {/* <p className="text-sm text-gray-900">
                                            Applied on <time dateTime={application.date}>{application.dateFull}</time>
                                        </p> */}
                                        {/* {product.info.quantity > 0 && <p className="mt-2 flex items-center text-sm text-gray-500">
                                            <CheckCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-green-400" aria-hidden="true" />
                                            In Stock
                                        </p>
                                        }
                                        {product.info.quantity === 0 && <p className="mt-2 flex items-center text-sm text-gray-500">
                                            <CheckCircleIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" aria-hidden="true" />
                                            Out of Stock
                                        </p>
                                        } */}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            {/* <ChevronRightIcon className="h-5 w-5 text-gray-400" aria-hidden="true" /> */}
                        </div>
                    </div>
                </Link>
            </li>
        </>
    )
}

export default ZoneItem