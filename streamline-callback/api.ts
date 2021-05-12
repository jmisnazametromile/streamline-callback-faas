interface Event {
    body: Message
}

interface Message {
    metaData: MetaData
}

interface MetaData {
    jwtData: Data
}

interface Data {
    processInstanceId: string;
    formName: string;
}

interface Return {
    status?: string;
    data?: string;
    error?: string;
}