import axios from "axios";

const buildClient = ({ req }) => {
  if (typeof window === "undefined") {
    // server side
    return axios.create({
      baseURL: "http://www.ticket-system.xyz/",
      headers: req.headers,
    });
  } else {
    // browser side from container
    return axios.create({
      baseURL: "/",
    });
  }
};

export default buildClient;
