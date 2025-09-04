// export const code = "import grpc\nfrom iecube_grpc import encoder_pb2\nfrom iecube_grpc import encoder_pb2_grpc\nimport time\nimport logging\nimport sys\n\n# 配置日志\nlogging.basicConfig(\n    level=logging.INFO,\n    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'\n)\nlogger = logging.getLogger(__name__)\n\ndef main():\n    \"\"\"主函数示例\"\"\"\n    # 创建gRPC通道\n    server_address = '127.0.0.1:50051'\n    logger.info(f\"Connecting to server at {server_address}...\")\n\n    channel = grpc.insecure_channel(server_address)\n    stub = encoder_pb2_grpc.EncoderServiceStub(channel)\n\n    try:\n        # 先添加编码器\n        logger.info(\"Adding encoder motor1...\")\n        encoder_config = encoder_pb2.EncoderConfig(\n            encoder_id=\"motor1\",\n            pin_a=19,\n            pin_b=26\n        )\n        logger.info(f\"Encoder config: {encoder_config}\")\n\n        try:\n            response = stub.AddEncoder(encoder_config)\n            logger.info(f\"Add encoder response: {response}\")\n\n            if not response.success:\n                logger.error(f\"Failed to add encoder: {response.message}\")\n                return\n\n            logger.info(f\"Encoder added successfully: {response.message}\")\n        except grpc.RpcError as e:\n            logger.error(f\"RPC error adding encoder: {str(e)}\")\n            if e.code() == grpc.StatusCode.INTERNAL:\n                logger.error(f\"Internal server error: {e.details()}\")\n            return\n\n        # 尝试获取编码器值\n        logger.info(\"Getting encoder value...\")\n        try:\n            value = stub.GetEncoderValue(encoder_pb2.EncoderId(encoder_id=\"motor1\"))\n            logger.info(f\"Encoder value: {value}\")\n        except grpc.RpcError as e:\n            logger.error(f\"Error getting encoder value: {str(e)}\")\n            if e.code() == grpc.StatusCode.NOT_FOUND:\n                logger.error(\"Encoder not found. Make sure the server is running and the encoder is properly added.\")\n                return\n            elif e.code() == grpc.StatusCode.INTERNAL:\n                logger.error(f\"Internal server error: {e.details()}\")\n\n        # 定义回调函数\n        def value_callback(value):\n            print(f\"Current value: {value}\")\n\n        # 开始流式读取\n        logger.info(\"Starting to stream encoder values...\")\n        try:\n            # 使用StreamConfig而不是EncoderId\n            stream_config = encoder_pb2.StreamConfig(\n                encoder_id=\"motor1\",\n                sampling_rate=20  # 20Hz采样率\n            )\n            for value in stub.StreamEncoderValues(stream_config):\n                print(f\"Streamed value: {value}\")\n                value_callback(value.value)\n                # time.sleep(0.05)  # 20Hz采样率\n        except grpc.RpcError as e:\n            logger.error(f\"RPC error streaming values: {str(e)}\")\n            if e.code() == grpc.StatusCode.NOT_FOUND:\n                logger.error(\"Encoder not found during streaming. The encoder may have been removed.\")\n            elif e.code() == grpc.StatusCode.INTERNAL:\n                logger.error(f\"Internal server error during streaming: {e.details()}\")\n\n    except KeyboardInterrupt:\n        logger.info(\"Received keyboard interrupt\")\n    except Exception as e:\n        logger.error(f\"Unexpected error: {str(e)}\")\n    finally:\n        channel.close()\n        logger.info(\"Channel closed\")\n\nif __name__ == '__main__':\n    main()"

export const code = `import grpc
from iecube_grpc import encoder_pb2
from iecube_grpc import encoder_pb2_grpc
import time
import logging
import sys

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

def main():
    """主函数示例"""
    # 创建gRPC通道
    server_address = '127.0.0.1:50051'
    logger.info(f"Connecting to server at {server_address}...")

    channel = grpc.insecure_channel(server_address)
    stub = encoder_pb2_grpc.EncoderServiceStub(channel)

    try:
        # 先添加编码器
        logger.info("Adding encoder motor1...")
        encoder_config = encoder_pb2.EncoderConfig(
            encoder_id="motor1",
            pin_a=19,
            pin_b=26
        )
        logger.info(f"Encoder config: {encoder_config}")

        try:
            response = stub.AddEncoder(encoder_config)
            logger.info(f"Add encoder response: {response}")

            if not response.success:
                logger.error(f"Failed to add encoder: {response.message}")
                return

            logger.info(f"Encoder added successfully: {response.message}")
        except grpc.RpcError as e:
            logger.error(f"RPC error adding encoder: {str(e)}")
            if e.code() == grpc.StatusCode.INTERNAL:
                logger.error(f"Internal server error: {e.details()}")
            return

        # 尝试获取编码器值
        logger.info("Getting encoder value...")
        try:
            value = stub.GetEncoderValue(encoder_pb2.EncoderId(encoder_id="motor1"))
            logger.info(f"Encoder value: {value}")
        except grpc.RpcError as e:
            logger.error(f"Error getting encoder value: {str(e)}")
            if e.code() == grpc.StatusCode.NOT_FOUND:
                logger.error("Encoder not found. Make sure the server is running and the encoder is properly added.")
                return
            elif e.code() == grpc.StatusCode.INTERNAL:
                logger.error(f"Internal server error: {e.details()}")

        # 定义回调函数
        def value_callback(value):
            print(f"Current value: {value}")

        # 开始流式读取
        logger.info("Starting to stream encoder values...")
        try:
            # 使用StreamConfig而不是EncoderId
            stream_config = encoder_pb2.StreamConfig(
                encoder_id="motor1",
                sampling_rate=20  # 20Hz采样率
            )
            for value in stub.StreamEncoderValues(stream_config):
                print(f"Streamed value: {value}")
                value_callback(value.value)
                # time.sleep(0.05)  # 20Hz采样率
        except grpc.RpcError as e:
            logger.error(f"RPC error streaming values: {str(e)}")
            if e.code() == grpc.StatusCode.NOT_FOUND:
                logger.error("Encoder not found during streaming. The encoder may have been removed.")
            elif e.code() == grpc.StatusCode.INTERNAL:
                logger.error(f"Internal server error during streaming: {e.details()}")

    except KeyboardInterrupt:
        logger.info("Received keyboard interrupt")
    except Exception as e:
        logger.error(f"Unexpected error: {str(e)}")
    finally:
        channel.close()
        logger.info("Channel closed")

if __name__ == '__main__':
    main()`