const publicarNotificacion = async () => {
  const url =
    "https://aeb4dd00-593d-433e-babe-659cfab9ba0f.pushnotifications.pusher.com/publish_api/v1/instances/aeb4dd00-593d-433e-babe-659cfab9ba0f/publishes";

  const data = {
    interests: ["hello"],
    web: {
      notification: {
        title: "Hello",
        body: "Hello, world!",
      },
    },
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Bearer BD092E217543A66CB8F004C7581D19CFD2E3D7D7B4DB050F2D7145C6CD0FF9C8",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const jsonResponse = await response.json();
      console.log("Notificación enviada con éxito:", jsonResponse);
    } else {
      console.error(
        "Error al enviar la notificación:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Error en la solicitud:", error);
  }
};

export default publicarNotificacion;
