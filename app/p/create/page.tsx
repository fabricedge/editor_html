
import FormPage from "../../ui/create"
import Header from '../../ui/header'
const CreatePage: React.FC = () => {
    return (
        <div>

            <Header user={{ name: "Knee" }} />
            <FormPage />
        </div>
    );
};

export default CreatePage;