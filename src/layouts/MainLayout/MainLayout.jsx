import Header from './components/Header';

const MainLayout = ({ children }) => {
    return (
        <div className="container mx-auto px-2">
            <Header />

            <main>{children}</main>
        </div>
    );
};

export default MainLayout;
