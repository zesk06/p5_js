#!/usr/bin/env python
# encoding: utf-8
# pylint: disable=C0111

import sys
from collection import namedtuple

"""
    generate log txt file with
    git log --pretty=format:"# %at %an"  --name-status > log.txt
    Then run this script
"""

Change = namedtuple('Change', ['mod', 'file'])


class Commit(object):

    def __init__():
        self.date = None
        self.author = None
        self.changes = []


def main():

    with open('log.txt', 'r') as input_f:
        for line in input_f.readlines():
            if line.strip() == '':
                # empty line
                continue
            if line.startwith('#'):
                # new commit
                pass

if __name__ == '__main__':
    main()
