import Layout from "components/Layout/Layout";
import BackgroundCard from "components/Layout/BackgroundCard/BackgroundCard";
import EditBeachComponent from "components/EditBeach"
const EditBeach = () => {
    return (
        <Layout>
            <BackgroundCard>
                <EditBeachComponent></EditBeachComponent>
            </BackgroundCard>
        </Layout>

    )
}

export default EditBeach;