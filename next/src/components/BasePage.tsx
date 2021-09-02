import Custom500 from './errors/500';
import Custom404 from './errors/404';
import CustomError from './errors/error';

const BasePage = ({error, content}) => {
    if (error) {
        switch (error.code) {
            case 404:
                return <Custom404/>
            case 500:
                return <Custom500 message={error.message}/>;
        }
        return <CustomError code={error.code} message={error.message}/>;
    }

    if (!content) {
        return <p>Fetching data...</p>
    }

    // TODO: general fallback page. Resolve specific pages above
    return <div>
        <p>content: {JSON.stringify(content)}</p>
    </div>;
};

export default BasePage;
