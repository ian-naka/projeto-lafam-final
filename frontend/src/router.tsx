import {
  Navigate,
  createRootRoute,
  createRoute,
  createRouter,
} from '@tanstack/react-router';
import App from './App';
import RotaProtegida from './componentes/RotaProtegida';
import Inicio from './paginas/Inicio';
import Login from './paginas/Login';
import Galeria from './paginas/Galeria';
import ListaPostagensCategoria from './paginas/ListaPostagensCategoria';
import DetalhePostagem from './paginas/DetalhePostagem';
import AdminPostagens from './paginas/logado/AdminPostagens';
import NovaPostagem from './paginas/logado/NovaPostagem';
import EditarPostagem from './paginas/logado/EditarPostagem';

const rootRoute = createRootRoute({
  component: App,
  notFoundComponent: () => <Navigate to="/" replace />,
});

const inicioRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Inicio,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'login',
  component: Login,
});

const galeriaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'galeria',
  component: Galeria,
});

const galeriaCategoriaRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'galeria/$slugCategoria',
  component: ListaPostagensCategoria,
});

const postDetalheRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'post/$slug',
  component: DetalhePostagem,
});

const acervoDetalheRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'acervo/$slug',
  component: DetalhePostagem,
});

const adminPostagensRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/postagens',
  component: () => (
    <RotaProtegida>
      <AdminPostagens />
    </RotaProtegida>
  ),
});

const novaPostagemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/nova-postagem',
  component: () => (
    <RotaProtegida>
      <NovaPostagem />
    </RotaProtegida>
  ),
});

const editarPostagemRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'admin/postagens/$slug/editar',
  component: () => (
    <RotaProtegida>
      <EditarPostagem />
    </RotaProtegida>
  ),
});

const criarRegistroRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: 'criar-registro',
  component: () => <Navigate to="/admin/nova-postagem" replace />,
});

const routeTree = rootRoute.addChildren([
  inicioRoute,
  loginRoute,
  galeriaRoute,
  galeriaCategoriaRoute,
  postDetalheRoute,
  acervoDetalheRoute,
  adminPostagensRoute,
  novaPostagemRoute,
  editarPostagemRoute,
  criarRegistroRoute,
]);

export const router = createRouter({
  routeTree,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
