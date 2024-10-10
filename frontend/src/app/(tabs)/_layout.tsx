import {Tabs} from "expo-router";

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "Index",
                    title: "Home",
                }}
            />
            <Tabs.Screen
                name="tempFolderForRouting/[Id]"
                options={{
                    headerTitle: "Temp Page",
                    title: "Temp Page",
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;