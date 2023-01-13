import axios from "axios";

export const authGet = async <T extends unknown>(url: string) => {
    // We get an object that looks like {data:}
    const headers = {
        "x-access-token" : localStorage.getItem("token")
    };

    const { data } = await axios.get<T>(
        url, { headers }
    );

    return data;
}

  