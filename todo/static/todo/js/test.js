    var Link = ReactRouter.Link;
    var RouteHandler = ReactRouter.RouteHandler;
    var Route = ReactRouter.Route;
    var DefaultRoute = ReactRouter.DefaultRoute;
    var App = React.createClass({
        render: function() {
            return <div>
                <p>My app</p>
                <div>
                    <Link to="home">Home</Link>
                    |<Link to="about">About</Link>
                </div>
                <RouteHandler />
            </div>;
        }
    });
    var Home = React.createClass({
        render: function() {
            return <div>
                <p>Home screen</p>
            </div>;
        }
    });
    var About = React.createClass({
        render: function() {
            return <div>
                <p>About screen</p>
            </div>;
        }
    });
    var routes = 
        <Route handler={App} >
            <DefaultRoute handler={Home} />
            <Route name="home" handler={Home} />
            <Route name="about" handler={About} />
        </Route>;
    console.log("routes loaded");