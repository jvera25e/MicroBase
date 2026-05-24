import asyncio
from main import staff_page
from fastapi import Request
class MockRequest:
    def __init__(self):
        self.cookies = {}
        self.scope = {'type': 'http'}
class MockDB:
    def query(self, *args):
        class MockQuery:
            def filter(self, *args):
                class MockFilter:
                    def first(self):
                        class MockUser:
                            role = 'admin'
                        return MockUser()
                return MockFilter()
        return MockQuery()

async def run():
    req = MockRequest()
    req.__class__ = Request
    res = await staff_page(req, MockDB())
    print("Response:", res)
asyncio.run(run())
