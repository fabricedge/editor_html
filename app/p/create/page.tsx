import React from "react";

import Header from '../../ui/header'
const CreatePage: React.FC = () => {
    return (
        <div>
            <Header user={{ name: "Knee" }} />
            <h1 className="text-black">Create New Page</h1>
            {/* Add your form or content here */}
        </div>
    );
};

export default CreatePage;