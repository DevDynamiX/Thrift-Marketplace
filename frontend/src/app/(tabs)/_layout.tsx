import {Tabs} from "expo-router";

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "Index",
                    title: "Index Page",
                }}
            />
            <Tabs.Screen
                name="tempFolderForRouting/[Id]"
                options={{
                    headerTitle: "Temp Page"
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;