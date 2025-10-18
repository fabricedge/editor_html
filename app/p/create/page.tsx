
import FormPage from "../../ui/create"
import Header from '../../ui/header'
const CreatePage: React.FC = () => {
    return (
        <div>
            <style>{`
              @layer base {
                html, body {
                  overflow: hidden;
                }
              }
            `}</style>
            <Header user={{ name: "Knee" }} />
            <FormPage />
        </div>
    );
};

export default CreatePage;