const baseUrl = "http://itx.ai/api";

export function pay(body: PayPayload): Promise<any> {
    return fetch(`${baseUrl}/pay`, {
        method: "POST",
        headers: {
          "content-type": "application/json"
        },
        body: JSON.stringify(body)
    }).then(response => {
        if (!response.ok) throw new Error();
        return response;
    })
}

interface PayPayload {
    readonly repository: string;
    readonly prId: number;
    readonly amount: number;
    readonly choice: boolean;
}
