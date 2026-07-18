import {createRoot} from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import {ReactQueryDevtools} from 'react-query/devtools'
import { AppRoutes } from './routing/AppRoutes'
import { AuthProvider } from './pages/auth'
import { ToastContainer } from 'react-toastify';
import ManagedModal from './components/ui/modal/ManagedModal'


// Assets
import '@/assets/sass/style.scss'
import '@/assets/sass/style.react.scss'
import '@/assets/css/main.css';
import 'react-toastify/dist/ReactToastify.css';
import { ModalProvider } from './components/ui/modal/Modal.Context'

const queryClient = new QueryClient()
const container = document.getElementById('root')

if (container) {
  createRoot(container).render(
    <QueryClientProvider client={queryClient}>
      <ModalProvider>
        <AuthProvider>
          <AppRoutes />
          <ToastContainer />
          <ManagedModal />
        </AuthProvider>
      </ModalProvider>
      {/* <ReactQueryDevtools /> */}
    </QueryClientProvider>
  )
}
